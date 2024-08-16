import * as solanaWeb3 from '@solana/web3.js'
import * as splTokenRegistry from '@solana/spl-token-registry'

import BaseAssetScanner from '../base.js'
import { createLogger } from '../../utils/index.js'

export const TOKEN_PROGRAM_ID = new solanaWeb3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')

const logger = createLogger('solana-base')

export default class BaseSolanaAssetScanner extends BaseAssetScanner {

	/** @protected @type {string[]} */										static requiredParamKeys = [ 'endpoint' ]
	/** @type {solanaWeb3.Connection} */									connection
	/** @type {Map<string, number>} */										decimalsByAddr = new Map()
	/** @protected @type {Map.<string, splTokenRegistry.TokenInfo>} */		tokenRegistryByAddr = new Map()

	/**
	 * @protected
	 */
	async _init() {
		await super._init()

		// solana connection
		this.connection = new solanaWeb3.Connection(this.paramDict.endpoint, {
			commitment: 'finalized',
			disableRetryOnRateLimit: true,
		})

		// get token registry for SPL decimals
		const tokenListProvider = await new splTokenRegistry.TokenListProvider().resolve()
		this.allTokenList = tokenListProvider.getList()
		this.allTokenList.forEach(tokenInfo => {
			this.tokenRegistryByAddr.set(tokenInfo.address, tokenInfo)
		})
	}

	/**
	 * @protected
	 * @param {solanaWeb3.Context} context
	 * @returns {Promise<Date>}
	 */
	async getDatetimeFromContext(context) {
		let timestamp = await this.rateLimiter.exec(() => this.connection.getBlockTime(context.slot), 'getTimestampFromContext()')
		if (!timestamp) {
			logger.warn(`Block time estimation not possible, using current time as timestamp... - slot: ${context.slot}`)
			return new Date()
		}
		return new Date(timestamp * 1000)
	}

	/**
	 * Get SPL token decimals from cache. On miss, retrieve from chain by getTokenSupply().
	 * 
	 * @protected
	 * @param {solanaWeb3.PublicKey | string} mintOrAddr
	 * @returns {Promise<number>}
	 */
	async getSplTokenDecimals(mintOrAddr) {
		const addr = mintOrAddr instanceof solanaWeb3.PublicKey? mintOrAddr.toBase58() : mintOrAddr
		const mint = mintOrAddr instanceof solanaWeb3.PublicKey? mintOrAddr : new solanaWeb3.PublicKey(mintOrAddr)

		// check cache
		const cachedValue = this.decimalsByAddr.get(addr)
		if (cachedValue !== undefined) return cachedValue

		// get from registry, if not found, get from rpc
		let decimals
		const tokenRegistry = this.tokenRegistryByAddr.get(addr)
		if (tokenRegistry) {
			decimals = tokenRegistry.decimals
		} else {
			const result = await this.rateLimiter.exec(() => this.connection.getTokenSupply(mint))
			decimals = result?.value?.decimals
		}

		// throw error if not found
		if (decimals === undefined) {
			throw new Error(`Failed to get SPL token decimals - addr: ${addr}`)
		}

		// cache and return
		this.decimalsByAddr.set(addr, decimals)
		return decimals
	}
}