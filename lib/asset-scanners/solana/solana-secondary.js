import * as solanaWeb3 from '@solana/web3.js'
import Decimal from 'decimal.js'

import { AssetQuery, AssetSnapshot, AssetInfo } from '../../models/index.js'
import * as enums from '../../enums.js'
import BaseSolanaAssetScanner, { TOKEN_PROGRAM_ID } from './base.js'

export default class SolanaSecondaryTokenScanner extends BaseSolanaAssetScanner {

	/** @type {AssetInfo[]} */						assetInfos
	/** @type {Map.<string, AssetInfo>} */			assetInfoByAddr = new Map()

	/**
	 * @protected
	 */
	async _init() {
		await super._init()
		this.assetInfos = await AssetInfo.getSecondaryTokens(this.chain)
		this.assetInfos.forEach(assetInfo => {
			this.assetInfoByAddr.set(assetInfo.address, assetInfo)
		})
	}

	/**
	 * @protected
	 * @param {AssetQuery} assetQuery
	 * @returns {Promise<AssetSnapshot[]>}
	 */
	async _query(assetQuery) {
		const pubkey = new solanaWeb3.PublicKey(assetQuery.addr)
		const { context, value } = await this.rateLimiter.exec(() =>this.connection.getParsedTokenAccountsByOwner(pubkey, { programId: TOKEN_PROGRAM_ID }, 'finalized'))
		const capturedAt = await this.rateLimiter.exec(() => this.getDatetimeFromContext(context))

		/** @type {Map<string, number>} */
		const assetAmountByAddr = new Map()
		value.forEach(rpcResult => {
			/** @type {string} */
			const tokenAddr = rpcResult.account?.data?.parsed?.info?.mint
			const assetInfo = this.assetInfoByAddr.get(tokenAddr)
			if (!assetInfo) return
			const amount = rpcResult.account?.data?.parsed?.info?.tokenAmount?.amount ?? 0
			if (amount == 0) return
			assetAmountByAddr.set(assetInfo.address, amount)
		})

		const promises = []
		assetAmountByAddr.forEach((amount, addr) => {
			promises.push(new Promise(async resolve => {
				const assetInfo = this.assetInfoByAddr.get(addr)
				const decimals = await this.getSplTokenDecimals(addr)
				const price = await this.priceAggregator.getPrice(assetInfo.code)
				const amountWithDp = new Decimal(amount).div(10 ** decimals)
				resolve(AssetSnapshot.fromJson({
					name: assetInfo.name,
					code: assetInfo.code,
					chain: this.chain,
					type: assetInfo.type,
					state: enums.AssetState.LIQUID,
					quantity: amountWithDp,
					usd_value: amountWithDp.mul(price),
					usd_value_per_quantity: price,
					captured_at: capturedAt,
				}))
			}))
		})

		return await Promise.all(promises)
	}
}