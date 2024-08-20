import * as errors from '../errors.js'
import { createLogger, BaseService } from '../utils/index.js'
import { PriceScannerConfig } from '../models/index.js'

/**
 * @typedef {import('rate-limiter').RateLimiterOpts} RateLimiterOpts
 */

const logger = createLogger('PriceScanner')

export default class BasePriceScanner extends BaseService {

	/** @protected @type {PriceScannerConfig} */				config

	/**
	 * @param {PriceScannerConfig} config
	 * @param {RateLimiterOpts} rateLimiterOpts
	 */
	constructor(config, rateLimiterOpts = {}) {
		if (config?.rateLimiterKey) {
			rateLimiterOpts.instanceKey = config.rateLimiterKey
		}
		super(config, rateLimiterOpts)
		this.config = config
	}

	/**
	 * @public
	 * @param {types.AssetCode} code
	 * @return {Promise<number>}
	 */
	async getPrice(code) {
		await this.initPromise

		if (!code) throw new errors.InvalidAssetCodeError(code)

		const price = await this._getPrice(code)
		if (price !== undefined) {
			logger.debug(`Price fetched - assetCode: ${code}, price: ${price}, scanner: ${this.constructor.name}`)
		} else {
			logger.debug(`price not available from this scanner - assetCode: ${code}, scanner: ${this.constructor.name}`)
		}
		return price
	}

	/**
	 * @protected
	 * @abstract
	 * @param {types.AssetCode} code
	 * @return {Promise<number>}
	 */
	async _getPrice(code) {
		throw new Error('not implemented')
	}
}