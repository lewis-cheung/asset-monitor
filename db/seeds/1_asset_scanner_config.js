import { Model } from 'objection'
import { AssetScannerConfig, AssetScannerType, Chain } from '../../lib/index.js'

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function seed(knex) {
	Model.knex(knex)
	await AssetScannerConfig.query(knex).insert([
		{
			type: AssetScannerType.ALGORAND_NATIVE,
			chain: Chain.ALGORAND,
			endpoint: 'dummy',
		},
		{
			type: AssetScannerType.APTOS_NATIVE,
			chain: Chain.APTOS,
			endpoint: 'https://rpc.ankr.com/http/aptos/v1',
		},
		{
			type: AssetScannerType.ETHEREUM_NATIVE,
			chain: Chain.AVALANCHE_C,
			endpoint: 'https://rpc.ankr.com/avalanche',
		},
		{
			type: AssetScannerType.BITCOIN_BLOCKCHAIR_NATIVE,
			chain: Chain.BITCOIN,
			endpoint: 'https://api.blockchair.com/bitcoin',
		},
		{
			type: AssetScannerType.BYBIT_SPOT,
			chain: Chain.BYBIT,
			is_enabled: false,
		},
		{
			type: AssetScannerType.CARDANO_BLOCKFROST_NATIVE,
			chain: Chain.CARDANO,
			api_key: 'dummy',
		},
		{
			type: AssetScannerType.COSMOS_NATIVE,
			chain: Chain.COMDEX,
			endpoint: 'https://rpc.comdex.one',
		},
		{
			type: AssetScannerType.COSMOS_NATIVE,
			chain: Chain.COSMOS_HUB,
			endpoint: 'https://cosmos-rpc.polkachu.com',
		},
		{
			type: AssetScannerType.ETHEREUM_NATIVE,
			chain: Chain.ETHEREUM,
			endpoint: 'https://rpc.ankr.com/eth',
		},
		{
			type: AssetScannerType.ETHEREUM_SECONDARY,
			chain: Chain.ETHEREUM,
			endpoint: 'https://rpc.ankr.com/eth',
		},
		{
			type: AssetScannerType.COSMOS_NATIVE,
			chain: Chain.EVMOS,
			endpoint: 'https://evmos-rpc.polkachu.com',
		},
		{
			type: AssetScannerType.COSMOS_NATIVE,
			chain: Chain.JUNO,
			endpoint: 'https://juno-rpc.polkachu.com',
		},
		{
			type: AssetScannerType.COSMOS_SECONDARY,
			chain: Chain.JUNO,
			endpoint: 'https://juno-rpc.polkachu.com',
		},
		{
			type: AssetScannerType.ETHEREUM_NATIVE,
			chain: Chain.MATIC,
			endpoint: 'https://polygon-rpc.com',
		},
		{
			type: AssetScannerType.MULTIVERSX_NATIVE,
			chain: Chain.MULTIVERSX,
			endpoint: 'https://api.multiversx.com',
		},
		{
			type: AssetScannerType.NEAR_NATIVE,
			chain: Chain.NEAR,
			endpoint: 'https://rpc.mainnet.near.org',
		},
		{
			type: AssetScannerType.COSMOS_NATIVE,
			chain: Chain.OSMOSIS,
			endpoint: 'https://osmosis-rpc.quickapi.com',
		},
		{
			type: AssetScannerType.COSMOS_NATIVE,
			chain: Chain.QUICKSILVER,
			endpoint: 'https://rpc.quicksilver.zone',
		},
		{
			type: AssetScannerType.COSMOS_NATIVE,
			chain: Chain.REBUS,
			endpoint: 'https://api.rebuschain.com:26657',
		},
		{
			type: AssetScannerType.RIPPLE_NATIVE,
			chain: Chain.RIPPLE,
			endpoint: 'wss://s1.ripple.com',
		},
		{
			type: AssetScannerType.COSMOS_NATIVE,
			chain: Chain.SECRET_NETWORK,
			endpoint: 'https://secretnetwork-rpc.stakely.io',
		},
		{
			type: AssetScannerType.COSMOS_NATIVE,
			chain: Chain.SIFCHAIN,
			endpoint: 'https://sifchain-rpc.polkachu.com',
		},
		{
			type: AssetScannerType.SOLANA_NATIVE,
			chain: Chain.SOLANA,
			endpoint: 'dummy',
		},
		{
			type: AssetScannerType.SOLANA_SECONDARY,
			chain: Chain.SOLANA,
			endpoint: 'dummy',
		},
		{
			type: AssetScannerType.ORCA_WHIRLPOOL,
			chain: Chain.SOLANA,
			endpoint: 'dummy',
			is_enabled: false,
		},
		{
			type: AssetScannerType.COSMOS_NATIVE,
			chain: Chain.STARGAZE,
			endpoint: 'https://rpc.stargaze-apis.com',
		},
		{
			type: AssetScannerType.COSMOS_NATIVE,
			chain: Chain.STRIDE,
			endpoint: 'https://stride.rpc.kjnodes.com',
		},
	])
}
