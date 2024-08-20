import fs from 'fs'
import path from 'path'

import yaml from 'js-yaml'
import cron from 'node-cron'
import Decimal from 'decimal.js'

import { escapeMarkdownV2 } from 'telegram-commander'

import { BaseAssetScanner, ScannerClassByType as AssetScannerClassByType } from './asset-scanners/index.js'
import AssetMonitorTelegramBot from './telegram-bot.js'
import * as enums from './enums.js'
import * as types from './types.js'
import * as errors from './errors.js'
import * as analytics from './analytics/index.js'
import PriceAggregator from './price-aggregator.js'
import { createLogger, isEnumMember, startOrInheritTransaction } from './utils/index.js'
import { AssetSnapshotBatch, AssetQuery, AssetGroup, AssetFlow, AssetScannerConfig } from './models/index.js'

/**
 * @typedef AssetMonitorOpts
 * @property {string} [secretsPath]
 */

const DEFAULT_SECRETS_PATH = './secrets.yaml'

const logger = createLogger('AssetMonitor')

export default class AssetMonitor {

	/** @protected @type {PriceAggregator} */								priceAggregator
	/** @protected @type {AssetMonitorTelegramBot} */						telegramBot = undefined
	/** @protected @type {number[]} */										telegramNotiChatIds = []
	/** @protected @type {boolean} */										isInitialized = false

	/**
	 * @param {AssetMonitorOpts} [opts={}]
	 */
	constructor(opts = {}) {
		const secretsPath = opts?.secretsPath ?? DEFAULT_SECRETS_PATH

		// load secrets
		logger.info(`Loading secrets: ${path.resolve(secretsPath)}`)
		const secretObj = yaml.load(fs.readFileSync(secretsPath, 'utf8'))

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
	 * @public
	 */
	async init() {
		if (this.isInitialized) return
		this.isInitialized = true

		logger.info(`Initializing AssetMonitor...`)

		this.priceAggregator = new PriceAggregator()
		await this.priceAggregator.init()

		logger.info(`AssetMonitor initialized.`)
	}

	/**
	 * @param {string|string[]} content
	 */
	async sendTelegramNoti(content) {
		await this.telegramBot?.sendMessage(this.telegramNotiChatIds, content)
	}

	/**
	 * @public
	 * @returns {Promise<types.ScanResult>}
	 */
	async scan() {
		logger.info(`Start scanning assets...`)
		const startTime = new Date()
		
		// Get all asset queries
		const assetQueries = await AssetQuery.query().modify('isEnabled')
		logger.info(`Found ${assetQueries.length} queries to scan...`)

		// Get all asset scanner configs
		const assetScannerConfigsMap = await this.getAssetScannerConfigsMap()

		/** @type {types.AssetSnapshot[]} */
		let snapshots
		let trial = 0
		while (trial <= 5) {
			trial++
			try {
				const promises = assetQueries.map(query => new Promise(async (resolve, reject) => {
					const scannerIdentifier = AssetScannerConfig.getScannerIdentifier(query.scanner_type, query.chain)
					const scannerConfigs = assetScannerConfigsMap.get(scannerIdentifier)
					if (!scannerConfigs || scannerConfigs.length == 0) {
						return reject(`No scanner found for query: ${JSON.stringify(query)}, scannerIdentifier: ${scannerIdentifier}`)
					}
					for (const scannerConfig of scannerConfigs) {
						const scanner = await this.createAssetScanner(scannerConfig)
						try {
							const result = await scanner.query(query)
							resolve(result)
							return
						} catch (err) {
							logger.error(`Error scanning asset - scannerConfig: ${scannerConfig.toString()}, queryId: ${query.id}, error: ${err}`)
						}
					}
					// TODO: share scanner instances
					reject(`Failed to scan query: ${JSON.stringify(query)}`)
				}))
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
	 * @private
	 * @return {Promise<Map<string, AssetScannerConfig[]>>}
	 */
	async getAssetScannerConfigsMap() {
		// TODO: to model
		const assetScannerConfigs = await AssetScannerConfig.getAll({ isEnabled: true })
		const map = new Map()
		for (const config of assetScannerConfigs) {
			const key = config.scannerIdentifier
			if (!map.has(key)) map.set(key, [])
			map.get(key).push(config)
		}
		return map
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
		await Promise.all(promises)
	}

	/**
	 * @private
	 * @param {AssetScannerConfig} config
	 * @returns {Promise<BaseAssetScanner>}
	 */
	async createAssetScanner(config) {
		logger.debug(`Creating Asset Scanner - chain: ${config.chain}, type: ${config.type}, endpoint: ${config.endpoint}`)

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
		const scanner = new scannerClass(this.priceAggregator, config)
		logger.debug(`AssetScanner created - chain: ${config.chain}, type: ${config.type}, endpoint: ${config.endpoint}`)
		return scanner
	}
}