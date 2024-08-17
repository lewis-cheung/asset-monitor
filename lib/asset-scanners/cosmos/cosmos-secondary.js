import * as enums from '../../enums.js'
import { parseDecimal } from '../../utils/index.js'
import BaseCosmosAssetScanner from './base.js'
import { AssetQuery, AssetSnapshot, AssetInfo } from '../../models/index.js'

export default class CosmosSecondaryTokenScanner extends BaseCosmosAssetScanner {

	/** @protected @type {AssetInfo[]} */					assetInfos

	async _init() {
		await super._init()
		this.assetInfos = await AssetInfo.getSecondaryTokens(this.chain)
	}

	/**
	 * @protected
	 * @param {AssetQuery} assetQuery
	 * @returns {Promise<AssetSnapshot[]>}
	 */
	async _query(assetQuery) {
		const results = []
	
		for (const assetInfo of this.assetInfos) {
			const contractQuery = { balance: { address: assetQuery.address } }
			const [ balanceRes, price, tokenInfo, block ] = await Promise.all([
				this.rateLimiter.exec(() => this.cwClient.queryContractSmart(assetInfo.address, contractQuery)),
				this.priceAggregator.getPrice(assetInfo.code),
				this.getTokenInfo(assetInfo.address),
				this.rateLimiter.exec(() => this.client.getBlock()),
			])

			if (!balanceRes?.balance) continue
			const balance = parseDecimal(balanceRes.balance, tokenInfo.decimals)
			results.push(AssetSnapshot.fromJson({
				name: tokenInfo.name,
				code: assetInfo.code,
				chain: this.chain,
				type: assetInfo.type,
				state: enums.AssetState.LIQUID,
				quantity: balance,
				usd_value: balance.mul(price),
				usd_value_per_quantity: price,
				captured_at: new Date(block.header.time),
			}))
		}

		return results
	}
}