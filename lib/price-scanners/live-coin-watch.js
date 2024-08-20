import fetch, { Headers } from 'node-fetch'

import BasePriceScanner from './base.js'
import { Cache, createLogger } from '../utils/index.js'

const PRICE_CACHE_TTL_MS = 30000
const logger = createLogger('LiveCoinWatchPriceScanner')

export default class LiveCoinWatchPriceScanner extends BasePriceScanner {

	/** @protected @type {string[]} */							static requiredParamKeys = [ 'endpoint', 'apiKey' ]
	/** @type {string} */										vsCurrency = 'USD'
	/** @protected @type {Cache<types.AssetCode, number>} */	priceCacheByCode
	/** @private @type {Promise<void>} */						priceFetchPromise

	/**
	 * @protected
	 */
	async _init() {
		await super._init()
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
	 * @protected
	 * @param {string[]} coinIds
	 * @returns {Promise<Map<types.AssetCode, number>>}
	 */
	async getPricesFromAPI(coinIds = []) {
		const res = await this.rateLimiter.exec(() => fetch(`${this.config.endpoint}/coins/map`, {
			method: 'POST',
			headers: new Headers({
				'content-type': 'application/json',
				'x-api-key': this.config.apiKey,
			}),
			body: JSON.stringify({
				codes: coinIds,
				currency: this.vsCurrency,
				meta: false,
			})
		}))

		/** @type {Map<string, number>} */
		const priceByCoinId = new Map()
		const resJson = await res.json()
		for (const priceInfo of resJson) {
			if (!priceInfo?.code || !priceInfo?.rate) continue
			priceByCoinId.set(priceInfo.code, priceInfo.rate)
		}

		/** @type {Map<types.AssetCode, number>} */
		const priceByCode = new Map()
		for (const [code, info] of this.scannerAssetInfoByCode) {
			const price = priceByCoinId.get(info.scannerSpecificCode)
			if (price === undefined) {
				logger.warn(`Price not found in API response - code: ${code}, scannerSpecificCode: ${info.scannerSpecificCode}`)
				continue
			}
			priceByCode.set(code, price)
		}
		return priceByCode
	}
}