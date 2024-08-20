import CoinGecko from 'coingecko-api'

import BasePriceScanner from './base.js'
import { Cache, createLogger } from '../utils/index.js'

const PRICE_CACHE_TTL_MS = 30000
const logger = createLogger('CoinGeckoPriceScanner')

export default class CoinGeckoPriceScanner extends BasePriceScanner {

	/** @type {string} */										vsCurrency = 'usd'
	/** @protected @type {CoinGecko} */							client
	/** @protected @type {Cache<types.AssetCode, number>} */	priceCacheByCode
	/** @private @type {Promise<void>} */						priceFetchPromise

	/**
	 * @protected
	 */
	async _init() {
		await super._init()
		this.client = new CoinGecko()
		this.priceCacheByCode = new Cache({ defaultTtlMs: PRICE_CACHE_TTL_MS })
	}

	/**
	 * @public
	 */
	async close() {
		await super.close()
		this.priceCacheByCode.close()
	}

	/**
	 * @protected
	 * @param {types.AssetCode} code
	 * @returns {Promise<number>}
	 */
	async _getPrice(code) {
		if (!this.scannerAssetInfoByCode.has(code)) return undefined

		const cachedPrice = this.priceCacheByCode.get(code)
		if (cachedPrice !== undefined) {
			logger.debug(`Price retrieved from cache - code: ${code}, price: ${cachedPrice}`)
			return cachedPrice
		}

		await this.getAndCacheAllPrices()
		return this.priceCacheByCode.get(code)
	}

	/**
	 * @protected
	 */
	async getAndCacheAllPrices() {
		if (this.priceFetchPromise) {
			logger.debug(`Already fetching prices, wait for promise to resolve...`)
			return await this.priceFetchPromise
		}

		this.priceFetchPromise = new Promise(async (resolve, reject) => {
			logger.info(`Fetch new prices...`)
			try {
				const coinIds = [...this.scannerAssetInfoByCode.values()].map(info => info.scannerSpecificCode)
				const priceByCode = await this.getPricesFromAPI(coinIds)
				for (const [code, price] of priceByCode) {
					this.priceCacheByCode.set(code, price)
				}
		
				logger.info(`Successfully retrieved prices.`)
				this.priceFetchPromise = undefined
				resolve()
			} catch (err) {
				logger.error(`Failed to fetch prices: ${err}`)
				this.priceFetchPromise = undefined
				reject(err)
			}
		})
	}

	/**
	 * @public
	 * @param {types.AssetCode} code
	 * @returns {Promise<string>}
	 */
	async getScannerSpecificAssetCode(code) {
		await this.initPromise
		return this.scannerAssetInfoByCode.get(code)?.scannerSpecificCode
	}

	/**
	 * @protected
	 * @param {string[]} coinIds
	 * @returns {Promise<Map<types.AssetCode, number>>}
	 */
	async getPricesFromAPI(coinIds) {
		const result = await this.rateLimiter.exec(async () => {
			const result = await this.client.simple.price({
				ids: coinIds.join(','),
				vs_currencies: this.vsCurrency,
			})
			if (result.success === false)
				throw new Error(result.message)
			if (!result.data)
				throw new Error('CoinGecko result does not contain data.')
			return result
		}, 'coin-gecko-get-price')

		const priceByCode = new Map()
		for (const [code, info] of this.scannerAssetInfoByCode) {
			if (!result.data?.[info.scannerSpecificCode]?.[this.vsCurrency]) {
				logger.warn(`Price not found in API response - code: ${code}, scannerSpecificCode: ${info.scannerSpecificCode}`)
				continue
			}
			priceByCode.set(code, result.data[info.scannerSpecificCode][this.vsCurrency])
		}
		return priceByCode
	}
}