import * as enums from '../../enums.js'
import { parseDecimal } from '../../utils/common.js'
import BaseEthereumAssetScanner from './base.js'
import erc20Abi from './erc20-abi.json' assert { type: 'json' }
import { AssetQuery, AssetSnapshot, AssetInfo } from '../../models/index.js'

export default class EthereumSecondaryTokenScanner extends BaseEthereumAssetScanner {

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
		const block = await this.rateLimiter.exec(() => this.web3.eth.getBlock('latest', true))

		/** @type {AssetSnapshot[]} */
		const results = []
		for (const assetInfo of this.assetInfos) {
			const contract = new this.web3.eth.Contract(erc20Abi, assetInfo.address)
			const [ { name, decimals }, balanceRaw, price ] = await Promise.all([
				this.getErc20Info(assetInfo.address),
				this.rateLimiter.exec(() => contract.methods.balanceOf(assetQuery.address).call()),
				this.priceAggregator.getPrice(assetInfo.code)
			])
			const balance = parseDecimal(balanceRaw, decimals)
			if (balance.cmp(0) == 0) continue

			results.push(AssetSnapshot.fromJson({
				name,
				code: assetInfo.code,
				chain: this.chain,
				type: assetInfo.type,
				state: enums.AssetState.LIQUID,
				quantity: balance,
				usd_value: balance.mul(price),
				usd_value_per_quantity: price,
				captured_at: new Date(Number(block.timestamp * 1000)),
			}))
		}
		// TODO: promise all

		return results
	}
}