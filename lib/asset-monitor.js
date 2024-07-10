import fs from 'fs'
import path from 'path'

import { BiMap } from 'mnemonist'
import yaml from 'js-yaml'
import cron from 'node-cron'
import mustache from 'mustache'
import Decimal from 'decimal.js'

import RateLimiter from 'rate-limiter'
import { escapeMarkdownV2 } from 'telegram-commander'

import { BasePriceScanner, ScannerClassByType as PriceScannerClassByType } from './price-scanners/index.js'
import { BaseAssetScanner, ScannerClassByType as AssetScannerClassByType } from './asset-scanners/index.js'
import AssetMonitorTelegramBot from './telegram-bot.js'
import * as enums from './enums.js'
import * as types from './types.js'
import * as errors from './errors.js'
import * as analytics from './analytics/index.js'
import PriceAggregator from './price-aggregator.js'
import { createLogger, isEnumMember, startOrInheritTransaction } from './utils/index.js'
import { AssetSnapshotBatch, AssetQuery, AssetGroup, AssetFlow } from './models/index.js'
/**
 * @typedef AssetMonitorOpts
 * @property {string} [scannerConfigPath]
 * @property {string} [queryConfigPath]
 * @property {string} [secretsPath]
 */

const DEFAULT_SCANNERS_CONFIG_PATH = './scanners-config.yaml'
const DEFAULT_SECRETS_PATH = './secrets.yaml'

const logger = createLogger('AssetMonitor')

export default class AssetMonitor {

	/** @type {Map<string, Map<string, BaseAssetScanner>>} */				assetScannerByChainByType = new Map()
	/** @protected @type {Map<string, BiMap<string, types.AssetCode>>} */	assetIdByCodeByChain = new Map()
	/** @protected @type {PriceAggregator} */								priceAggregator = new PriceAggregator()
	/** @protected @type {AssetMonitorTelegramBot} */						telegramBot = undefined
	/** @protected @type {number[]} */										telegramNotiChatIds = []

	/**
	 * @param {AssetMonitorOpts} [opts={}]
	 */
	constructor(opts = {}) {
		const scannersConfigPath = opts?.scannerConfigPath ?? DEFAULT_SCANNERS_CONFIG_PATH
		const secretsPath = opts?.secretsPath ?? DEFAULT_SECRETS_PATH

		// load secrets
		logger.info(`Loading secrets: ${path.resolve(secretsPath)}`)
		const secretObj = yaml.load(fs.readFileSync(secretsPath, 'utf8'))

		// load and process scanners config
		logger.info(`Setting up scanners with config: ${path.resolve(scannersConfigPath)}`)
		/** @type {types.ScannersConfig} */
		const scannersConfig = this.loadConfig(scannersConfigPath, secretObj)
		this.setupScanners(scannersConfig)

		// start telegram bot
		if (secretObj?.telegramBotToken) {
			logger.info(`Starting telegram bot...`)
			this.telegramBot = new AssetMonitorTelegramBot(secretObj.telegramBotToken, {
				logger: createLogger('telegram-bot'),
				whitelistedChatIds: secretObj.telegramWhitelistedChatIds,
			})
			if (secretObj.telegramNotiChatIds) {
				this.telegramNotiChatIds = [ secretObj.telegramNotiChatIds ].flat()
			}
			this.telegramBot.initAssetMonitorCommands(this)
		}
	}

	/**
	 * @protected
	 * @param {string} path
	 * @param {object} [secretObj]
	 * @returns {types.ScannersConfig | types.QueryConfig}
	 */
	loadConfig(path, secretObj) {
		const rawConfig = yaml.load(fs.readFileSync(path, 'utf8'))
		if (!secretObj) return rawConfig
		const configJsonStr = JSON.stringify(rawConfig)
		return JSON.parse(mustache.render(configJsonStr, secretObj))
	}

	/**
	 * @param {string|string[]} content
	 */
	async sendTelegramNoti(content) {
		await this.telegramBot?.sendMessage(this.telegramNotiChatIds, content)
	}

	/**
	 * @public
	 * @param {object} [opts={}]
	 * @param {number[]} [opts.groupIds=[]]
	 * @returns {Promise<types.ScanResult>}
	 */
	async scan(opts = {}) {
		logger.info(`Start scanning assets...`)
		const startTime = new Date()
		
		// Get all asset queries
		const query = AssetQuery.query().modify('isEnabled')
		if (opts?.groupIds && opts?.groupIds?.length > 0) {
			logger.info(`Scanning for groupIds: ${opts.groupIds}`)
			query.whereIn('group_id', opts.groupIds)
		}
		const assetQueries = await query
		logger.info(`Found ${assetQueries.length} queries to scan...`)

		/** @type {types.AssetSnapshot[]} */
		let snapshots
		let trial = 0
		while (trial <= 5) {
			trial++
			try {
				const promises = assetQueries.map(query => {
					const scanner = this.assetScannerByChainByType.get(query.scanner_type)?.get(query.chain)
					if (!scanner) {
						throw new Error(`No scanner found for query: ${JSON.stringify(query)}`)
					}
					return scanner.query(query)
				})
				snapshots = (await Promise.all(promises)).flat()
				break
			} catch (err) {
				logger.error(`Error scanning assets: ${err}`)
				if (trial <= 5) {
					logger.info(`Retrying...`)
				} else {
					logger.error(`Max retry reached. Giving up.`)
					await this.sendTelegramNoti(escapeMarkdownV2(`Error scanning assets: ${err}`))
					throw err
				}
			}
		}
		const endTime = new Date()

		/** @type {types.ScanResult} */
		const result = {
			snapshots,
			totalUSDValue: snapshots.reduce((acc, cur) => acc.add(cur.usd_value), new Decimal(0)),
			startTime,
			endTime,
			timeUsedMs: endTime.getTime() - startTime.getTime(),
		}
		logger.info(`Finished scanning assets - totalValue: ${result.totalUSDValue}, timeUsedMs: ${result.timeUsedMs}, resultCount: ${snapshots.length}`)
		return result
	}

	/**
	 * @public
	 * @param {types.AssetGroupSpecifier} fromGroupSpecifier
	 * @param {types.AssetGroupSpecifier} toGroupSpecifier
	 * @param {Decimal.Value} value
	 * @param {object} [opts={}]
	 * @param {Date} [opts.time]
	 * @param {Transaction} [opts.trx]
	 * @param {bool} [opts.createGroup=false] Create group if not exist
	 * @returns {Promise<AssetFlow>}
	 */
	async recordFlow(fromGroupSpecifier, toGroupSpecifier, value, opts = {}) {
		return await startOrInheritTransaction(async (trx) => {
			let investedValue = new Decimal(value)

			const [ fromGroupId, toGroupId ] = await Promise.all([
				await AssetGroup.getGroupId(fromGroupSpecifier, { trx, create: opts?.createGroup }),
				await AssetGroup.getGroupId(toGroupSpecifier, { trx, create: opts?.createGroup }),
			])
			if (!fromGroupId && !toGroupId) throw new Error('Must provide either fromGroup or toGroup.')

			// outflow
			if (!toGroupId) {
				logger.info(`Getting pnl% to calculate invested value...`)
				const totalValue = await analytics.getTotalValue()
				const pastInvestedValue = await analytics.getTotalInvestedValue({ trx })
				const pnlRatio = pastInvestedValue.eq(0) ? new Decimal(1) : totalValue.div(pastInvestedValue)
				investedValue = new Decimal(value).div(pnlRatio)
				logger.info(`pastInvestedValue: ${pastInvestedValue}, pnlRatio: ${pnlRatio.sub(1).mul(100)}%`)
			}

			// record flow
			const flow = await AssetFlow.query(trx).insert({
				from_group_id: fromGroupId,
				to_group_id: toGroupId,
				actual_usd_value: new Decimal(value).toString(),
				invested_usd_value: investedValue.toString(),
				executed_at: opts?.time?.toISOString(),
			})

			return flow
		}, opts?.trx)
	}

	/**
	 * @public
	 * @param {string} [cronSchedule='0 * * * *']
	 * @returns {Promise<void>}
	 */
	async monitor(cronSchedule = '0 * * * *') {
		logger.info(`Start monitoring assets with cron: '${cronSchedule}'...`)
		cron.schedule(cronSchedule, async () => {
			const scanResult = await this.scan()
			logger.info('Storing query results...')
			const batch = await AssetSnapshotBatch.store(scanResult)
			logger.info(`Results stored - batchId: ${batch.id}`)
		})
		await this.sendTelegramNoti(escapeMarkdownV2(`AssetMonitor started with cron: '${cronSchedule}'`))
	}

	/**
	 * @public
	 */
	async close() {
		const promises = [
			this.priceAggregator.close()
		]
		for (let [_, scannerByChain] of this.assetScannerByChainByType) {
			for (let [_, scanner] of scannerByChain) {
				promises.push(scanner.close())
			}
		}
		await Promise.all(promises)
	}

	/**
	 * @public
	 * @param {types.AssetScannerConfig} config
	 */
	addAssetScanner(config) {
		logger.debug(`Adding Asset Scanner - ${JSON.stringify(config)}`)

		if (!isEnumMember(enums.AssetScannerType, config.type)) {
			throw new errors.InvalidAssetScannerTypeError(config.type)
		}

		// get scanner class
		/** @type {typeof BaseAssetScanner} */
		const scannerClass = AssetScannerClassByType[config.type]
		if (!scannerClass) {
			throw new errors.NotImplementedError(`AssetScannerType: ${config.type}`)
		}

		// instantiate scanner
		const assetInfoMap = this.assetIdByCodeByChain.get(config.chain)
		const scanner = new scannerClass(this.priceAggregator, config.chain, assetInfoMap, config.params)
		if (!this.assetScannerByChainByType.has(config.type)) {
			this.assetScannerByChainByType.set(config.type, new Map())
		}
		this.assetScannerByChainByType.get(config.type).set(config.chain, scanner)
		logger.debug(`AssetScanner added - type: ${config.type}, chain: ${config.chain}, config: ${JSON.stringify(config)}`)
	}

	/**
	 * @public
	 * @param {types.PriceScannerConfig} config
	 */
	addPriceScanner(config) {
		logger.debug(`Adding Price Scanner - ${JSON.stringify(config)}`)

		if (!isEnumMember(enums.PriceScannerType, config.type)) {
			throw new errors.InvalidPriceScannerTypeError(config.type)
		}

		// get scanner class
		/** @type {typeof BasePriceScanner} */
		const scannerClass = PriceScannerClassByType[config.type]
		if (!scannerClass) {
			throw new errors.NotImplementedError(`PriceScannerType: ${config.type}`)
		}

		// instantiate scanner
		const scanner = new scannerClass(config.params, config.assetIdByCode)
		this.priceAggregator.addPriceScanner(config.type, scanner)
		logger.debug(`PriceScanner added - name: ${scannerClass.constructor.name}, config: ${JSON.stringify(config)}`)
	}

	/**
	 * @protected
	 * @param {types.ScannersConfig} config
	 */
	setupScanners(config) {
		// rate limiters
		if (config.rateLimiters) {
			for (const rateLimiterConfig of config.rateLimiters) {
				if (rateLimiterConfig.callPerSec === undefined) {
					logger.warn(`Defining rate limiter without specifying callPerSec does nothing.`)
				} else {
					RateLimiter.getInstance({ instanceKey: rateLimiterConfig.key, callPerSec: rateLimiterConfig.callPerSec })
				}
			}
		}

		// store assetInfoMaps
		if (config.assetIdByCodeByChain && typeof config.assetIdByCodeByChain == 'object') {
			logger.debug(`scannersConfig.assetIdByCodeByChain found. Storing them in memory...`)
			for (const chain in config.assetIdByCodeByChain) {
				const newMap = BiMap.from(config.assetIdByCodeByChain[chain] ?? {})
				this.assetIdByCodeByChain.set(chain, newMap)
			}
		} else {
			logger.debug(`Missing scannersConfig.assetIdByCodeByChain.`)
		}

		// price scanners
		if (config.priceScanners) {
			for (const scannerConfig of config.priceScanners) {
				this.addPriceScanner(scannerConfig)
			}
		} else {
			logger.warn(`ScannersConfig does not have priceScanners.`)
		}

		// asset scanners
		if (config.assetScanners) {
			for (const scannerConfig of config.assetScanners) {
				this.addAssetScanner(scannerConfig)
			}
		} else {
			logger.warn(`ScannersConfig does not have assetScanners.`)
		}
	}
}