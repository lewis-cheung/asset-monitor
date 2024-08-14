import * as enums from '../../enums.js'
import { parseDecimal, humanize } from '../../utils/index.js'
import BaseAlgorandAssetScanner from './base.js'
import { AssetQuery, AssetSnapshot, AssetInfo } from '../../models/index.js'

export default class AlgorandNativeTokenScanner extends BaseAlgorandAssetScanner {

	/** @type {number} */					static assetDecimals = 6
	/** @protected @type {AssetInfo} */		nativeAssetInfo

	/**
	 * @protected
	 */
	async _init() {
		await super._init()
		this.nativeAssetInfo = await AssetInfo.getNativeToken(this.chain)
	}

	/**
	 * @protected
	 * @param {AssetQuery} assetQuery
	 * @returns {Promise<AssetSnapshot[]>}
	 */
	async _query(assetQuery) {
		const [ acc, price ] = await Promise.all([
			this.rateLimiter.exec(() => this.client.accountInformation(assetQuery.addr).do()),
			this.priceAggregator.getPrice(this.nativeAssetInfo.code),
		])

		/** @type {AssetSnapshot[]} */
		const results = []

		// Liquid amount
		const liquidAmount = parseDecimal(acc['amount-without-pending-rewards'], AlgorandNativeTokenScanner.assetDecimals)
		if (liquidAmount.cmp(0) > 0) {
			results.push(AssetSnapshot.fromJson({
				name: `${humanize(this.chain)} Native Token`,
				code: this.nativeAssetInfo.code,
				chain: this.chain,
				type: enums.AssetType.NATIVE_TOKEN,
				state: enums.AssetState.LIQUID,
				quantity: liquidAmount,
				usd_value: liquidAmount.mul(price),
				usd_value_per_quantity: price,
			}))
		}

		// TODO: staked amount
		// TODO: staking reward

		return results
	}
}