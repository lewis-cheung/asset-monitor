import * as enums from './enums.js'
import * as errors from './errors.js'
import { createLogger } from './utils/index.js'
import { PriceScannerConfig } from './models/index.js'
import { BasePriceScanner, ScannerClassByType } from './price-scanners/index.js'

const logger = createLogger('PriceAggregator')

export default class PriceAggregator {
	
	/** @protected @type {Map<enums.PriceScannerType, BasePriceScanner>} */		scannerByType = new Map()
	/** @protected @type {boolean} */											isInitialized = false

	/**
	 * @param {enums.PriceScannerType} type
	 * @returns {BasePriceScanner}
	 */
	getScanner(type) {
		return this.scannerByType.get(type)
	}

	/**
	 * @public
	 */
	async init() {
		if (this.isInitialized) return
		this.isInitialized = true

		const configs = await PriceScannerConfig.getAll()
		const promises = configs.map(config => this.addPriceScanner(config))
		await Promise.all(promises)
	}

	/**
	 * @public
	 */
	async close() {
		const promises = [ ...this.scannerByType.values() ].map(scanner => scanner.close())
		await Promise.all(promises)
		logger.debug('closed.')
	}

	/**
	 * @public
	 * @param {types.AssetCode} code
	 * @returns {Promise<number>}
	 */
	async getPrice(code) {
		if (this.scannerByType.size === 0) {
			throw new Error('No scanner.')
		}
		
		// get price from all scanners
		const promises = [ ...this.scannerByType.values() ].map(scanner => scanner.getPrice(code))
		const prices = (await Promise.all(promises)).filter(price => price !== undefined)
		if (prices.length === 0) {
			throw new Error(`No valid prices - code: ${code}`)
		}
		const avgPrice = prices.reduce((acc, cur) => acc + cur, 0) / prices.length
		logger.debug(`${code} price aggregated from ${prices.length} sources: ${avgPrice}`)

		// calculate the differences between the average price and the price from each scanner to check if the price is valid
		if (prices.some(price => Math.abs((avgPrice - price) / price) > 0.1)) {
			throw new Error(`Price difference too large - code: ${code}, avgPrice: ${avgPrice}, prices: ${prices.join(', ')}`)
		}

		return avgPrice
	}

	/**
	 * @protected
	 * @param {PriceScannerConfig} config
	 */
	async addPriceScanner(config) {
		logger.debug(`Adding Price Scanner - id: ${config.id}, type: ${config.type}`)

		if (!isEnumMember(enums.PriceScannerType, config.type)) {
			throw new errors.InvalidPriceScannerTypeError(config.type)
		} else if (this.scannerByType.has(config.type)) {
			throw new Error('Cannot add price scanner of the same type twice.')
		}

		// get scanner class
		/** @type {typeof BasePriceScanner} */
		const scannerClass = ScannerClassByType[config.type]
		if (!scannerClass) {
			throw new errors.NotImplementedError(`PriceScannerType: ${config.type}`)
		}

		// instantiate scanner
		const scanner = new scannerClass(config)
		await scanner.init()
		this.priceAggregator.addPriceScanner(config.type, scanner)
		this.scannerByType.set(config.type, scanner)
		logger.debug(`PriceScanner added - name: ${scannerClass.constructor.name}, id: ${config.id}, type: ${config.type}`)
	}
}