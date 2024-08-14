import { Model } from 'objection'
import { AssetScannerConfig, AssetScannerType, AssetInfo, Chain } from '../../lib/index.js'

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

	await AssetInfo.query(knex).insert([
		{
			chain: Chain.ALGORAND,
			code: 'ALGO',
			type: 'native-token',
		},
		{
			chain: Chain.APTOS,
			code: 'APTOS',
			type: 'native-token',
		},
		{
			chain: Chain.AVALANCHE_C,
			code: 'AVAX',
			type: 'native-token',
		},
		{
			chain: Chain.BITCOIN,
			code: 'BTC',
			type: 'native-token',
		},
		{
			chain: Chain.BYBIT,
			code: 'ADA',
			type: 'cex-token',
			address: 'ADA',
		},
		{
			chain: Chain.BYBIT,
			code: 'ALGO',
			type: 'cex-token',
			address: 'ALGO',
		},
		{
			chain: Chain.BYBIT,
			code: 'APT',
			type: 'cex-token',
			address: 'APT',
		},
		{
			chain: Chain.BYBIT,
			code: 'ATOM',
			type: 'cex-token',
			address: 'ATOM',
		},
		{
			chain: Chain.BYBIT,
			code: 'AVAX',
			type: 'cex-token',
			address: 'AVAX',
		},
		{
			chain: Chain.BYBIT,
			code: 'BNB',
			type: 'cex-token',
			address: 'BNB',
		},
		{
			chain: Chain.BYBIT,
			code: 'BTC',
			type: 'cex-token',
			address: 'BTC',
		},
		{
			chain: Chain.BYBIT,
			code: 'DOGE',
			type: 'cex-token',
			address: 'DOGE',
		},
		{
			chain: Chain.BYBIT,
			code: 'EGLD',
			type: 'cex-token',
			address: 'EGLD',
		},
		{
			chain: Chain.BYBIT,
			code: 'ETH',
			type: 'cex-token',
			address: 'ETH',
		},
		{
			chain: Chain.BYBIT,
			code: 'GMT',
			type: 'cex-token',
			address: 'GMT',
		},
		{
			chain: Chain.BYBIT,
			code: 'LDO',
			type: 'cex-token',
			address: 'LDO',
		},
		{
			chain: Chain.BYBIT,
			code: 'LUNA',
			type: 'cex-token',
			address: 'LUNA',
		},
		{
			chain: Chain.BYBIT,
			code: 'LUNC',
			type: 'cex-token',
			address: 'LUNC',
		},
		{
			chain: Chain.BYBIT,
			code: 'MATIC',
			type: 'cex-token',
			address: 'MATIC',
		},
		{
			chain: Chain.BYBIT,
			code: 'NEAR',
			type: 'cex-token',
			address: 'NEAR',
		},
		{
			chain: Chain.BYBIT,
			code: 'SHIB',
			type: 'cex-token',
			address: 'SHIB',
		},
		{
			chain: Chain.BYBIT,
			code: 'SOL',
			type: 'cex-token',
			address: 'SOL',
		},
		{
			chain: Chain.BYBIT,
			code: 'USDC',
			type: 'cex-token',
			address: 'USDC',
		},
		{
			chain: Chain.BYBIT,
			code: 'USDT',
			type: 'cex-token',
			address: 'USDT',
		},
		{
			chain: Chain.BYBIT,
			code: 'XRP',
			type: 'cex-token',
			address: 'XRP',
		},
		{
			chain: Chain.CARDANO,
			code: 'ADA',
			type: 'native-token',
		},
		{
			chain: Chain.COMDEX,
			code: 'CMDX',
			type: 'native-token',
		},
		{
			chain: Chain.COSMOS_HUB,
			code: 'ATOM',
			type: 'native-token',
		},
		{
			chain: Chain.DYMENSION,
			code: 'DYM',
			type: 'native-token',
		},
		{
			chain: Chain.ETHEREUM,
			code: 'ETH',
			type: 'native-token',
		},
		{
			chain: Chain.ETHEREUM,
			code: 'stETH',
			type: 'secondary-token',
			address: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
		},
		{
			chain: Chain.ETHEREUM,
			code: 'USDC',
			type: 'secondary-token',
			address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
		},
		{
			chain: Chain.ETHEREUM,
			code: 'USDT',
			type: 'secondary-token',
			address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
		},
		{
			chain: Chain.EVMOS,
			code: 'EVMOS',
			type: 'native-token',
		},
		{
			chain: Chain.JUNO,
			code: 'JUNO',
			type: 'native-token',
		},
		{
			chain: Chain.JUNO,
			code: 'GLTO',
			type: 'secondary-token',
			address: 'juno1j0a9ymgngasfn3l5me8qpd53l5zlm9wurfdk7r65s5mg6tkxal3qpgf5se',
		},
		{
			chain: Chain.MATIC,
			code: 'MATIC',
			type: 'native-token',
		},
		{
			chain: Chain.MULTIVERSX,
			code: 'EGLD',
			type: 'native-token',
		},
		{
			chain: Chain.NEAR,
			code: 'NEAR',
			type: 'native-token',
		},
		{
			chain: Chain.OSMOSIS,
			code: 'OSMO',
			type: 'native-token',
		},
		{
			chain: Chain.QUICKSILVER,
			code: 'QCK',
			type: 'native-token',
		},
		{
			chain: Chain.REBUS,
			code: 'REBUS',
			type: 'native-token',
		},
		{
			chain: Chain.RIPPLE,
			code: 'XRP',
			type: 'native-token',
		},
		{
			chain: Chain.SECRET_NETWORK,
			code: 'SCRT',
			type: 'native-token',
		},
		{
			chain: Chain.SIFCHAIN,
			code: 'ROWAN',
			type: 'native-token',
		},
		{
			chain: Chain.SOLANA,
			code: 'SOL',
			type: 'native-token',
		},
		{
			chain: Chain.SOLANA,
			code: 'GMT',
			type: 'secondary-token',
			address: '7i5KKsX2weiTkry7jA4ZwSuXGhs5eJBEjY8vVxR4pfRx',
		},
		{
			chain: Chain.SOLANA,
			code: 'GST',
			type: 'secondary-token',
			address: 'AFbX8oGjGpmVFywbVouvhQSRmiW2aR1mohfahi4Y2AdB',
		},
		{
			chain: Chain.SOLANA,
			code: 'KI',
			type: 'secondary-token',
			address: 'kiGenopAScF8VF31Zbtx2Hg8qA5ArGqvnVtXb83sotc',
		},
		{
			chain: Chain.SOLANA,
			code: 'MNDE',
			type: 'secondary-token',
			address: 'MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey',
		},
		{
			chain: Chain.SOLANA,
			code: 'ORCA',
			type: 'secondary-token',
			address: 'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE',
		},
		{
			chain: Chain.SOLANA,
			code: 'RAY',
			type: 'secondary-token',
			address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
		},
		{
			chain: Chain.SOLANA,
			code: 'mSOL',
			type: 'secondary-token',
			address: 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
		},
		{
			chain: Chain.SOLANA,
			code: 'wSOL',
			type: 'secondary-token',
			address: 'So11111111111111111111111111111111111111112',
		},
		{
			chain: Chain.SOLANA,
			code: 'USDC',
			type: 'secondary-token',
			address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
		},
		{
			chain: Chain.SOLANA,
			code: 'USDT',
			type: 'secondary-token',
			address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
		},
		{
			chain: Chain.STARGAZE,
			code: 'STARS',
			type: 'native-token',
		},
		{
			chain: Chain.STRIDE,
			code: 'STRD',
			type: 'native-token',
		},
	])
}
