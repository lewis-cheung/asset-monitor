import * as nearAPI from 'near-api-js'

import BaseAssetScanner from '../base.js'

export default class BaseNearAssetScanner extends BaseAssetScanner {

	/** @protected @type {string[]} */		static requiredParamKeys = [ 'endpoint' ]
	/** @type {nearAPI.Near} */				client

	/**
	 * @protected
	 */
	async _init() {
		await super._init()

		const connectionConfig = {
			networkId: "mainnet",
			// keyStore: myKeyStore,
			nodeUrl: this.paramDict.endpoint,
			// walletUrl: "https://wallet.mainnet.near.org",
			// helperUrl: "https://helper.mainnet.near.org",
			// explorerUrl: "https://nearblocks.io",
		}
		this.client = await nearAPI.connect(connectionConfig)
	}
}