import { Model } from 'objection'
import { PriceScannerConfig, PriceScannerType, PriceScannerAssetInfo } from '../../lib/index.js'

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function seed(knex) {
	Model.knex(knex)

	await PriceScannerConfig.query(knex).insert([
		{
			type: PriceScannerType.COIN_GECKO,
		},
		{
			type: PriceScannerType.LIVE_COIN_WATCH,
			is_enabled: false,
			endpoint: 'https://api.livecoinwatch.com',
			api_key: 'dummy',
		},
	])

	await PriceScannerAssetInfo.query(knex).insert([
		// CoinGecko
		{
			price_scanner_type: PriceScannerType.COIN_GECKO,
			asset_code: 'ADA',
			scanner_specific_code: 'cardano',
		},
		{
			price_scanner_type: PriceScannerType.COIN_GECKO,
			asset_code: 'ALGO',
			scanner_specific_code: 'algorand',
		},
		{
			price_scanner_type: PriceScannerType.COIN_GECKO,
			asset_code: 'APT',
			scanner_specific_code: 'aptos',
		},
		{
			price_scanner_type: PriceScannerType.COIN_GECKO,
			asset_code: 'ATOM',
			scanner_specific_code: 'cosmos',
		},
		{
			price_scanner_type: PriceScannerType.COIN_GECKO,
			asset_code: 'AVAX',
			scanner_specific_code: 'avalanche-2',
		},
		{
			price_scanner_type: PriceScannerType.COIN_GECKO,
			asset_code: 'BNB',
			scanner_specific_code: 'binancecoin',
		},
		{
			price_scanner_type: PriceScannerType.COIN_GECKO,
			asset_code: 'BTC',
			scanner_specific_code: 'bitcoin',
		},
		{
			price_scanner_type: PriceScannerType.COIN_GECKO,
			asset_code: 'CMDX',
			scanner_specific_code: 'comdex',
		},
		{
			price_scanner_type: PriceScannerType.COIN_GECKO,
			asset_code: 'DOGE',
			scanner_specific_code: 'dogecoin',
		},
		{
			price_scanner_type: PriceScannerType.COIN_GECKO,
			asset_code: 'DYM',
			scanner_specific_code: 'dymension',
		},
		{
			price_scanner_type: PriceScannerType.COIN_GECKO,
			asset_code: 'EGLD',
			scanner_specific_code: 'elrond-erd-2',
		},
		{
			price_scanner_type: PriceScannerType.COIN_GECKO,
			asset_code: 'ETH',
			scanner_specific_code: 'ethereum',
		},
		{
			price_scanner_type: PriceScannerType.COIN_GECKO,
			asset_code: 'stETH',
			scanner_specific_code: 'staked-ether',
		},
		{
			price_scanner_type: PriceScannerType.COIN_GECKO,
			asset_code: 'EVMOS',
			scanner_specific_code: 'evmos',
		},
		{
			price_scanner_type: PriceScannerType.COIN_GECKO,
			asset_code: 'GMT',
			scanner_specific_code: 'stepn',
		},
		{
			price_scanner_type: PriceScannerType.COIN_GECKO,
			asset_code: 'GST',
			scanner_specific_code: 'green-satoshi-token',
		},
		{
			price_scanner_type: PriceScannerType.COIN_GECKO,
			asset_code: 'JUNO',
			scanner_specific_code: 'juno-network',
		},
		{
			price_scanner_type: PriceScannerType.COIN_GECKO,
			asset_code: 'KI',
			scanner_specific_code: 'genopet-ki',
		},
		{
			price_scanner_type: PriceScannerType.COIN_GECKO,
			asset_code: 'LDO',
			scanner_specific_code: 'lido-dao',
		},
		{
			price_scanner_type: PriceScannerType.COIN_GECKO,
			asset_code: 'LUNA',
			scanner_specific_code: 'terra-luna-2',
		},
		{
			price_scanner_type: PriceScannerType.COIN_GECKO,
			asset_code: 'LUNC',
			scanner_specific_code: 'terra-luna',
		},
		{
			price_scanner_type: PriceScannerType.COIN_GECKO,
			asset_code: 'MATIC',
			scanner_specific_code: 'matic-network',
		},
		{
			price_scanner_type: PriceScannerType.COIN_GECKO,
			asset_code: 'MNDE',
			scanner_specific_code: 'marinade',
		},
		{
			price_scanner_type: PriceScannerType.COIN_GECKO,
			asset_code: 'NEAR',
			scanner_specific_code: 'near',
		},
		{
			price_scanner_type: PriceScannerType.COIN_GECKO,
			asset_code: 'ORCA',
			scanner_specific_code: 'orca',
		},
		{
			price_scanner_type: PriceScannerType.COIN_GECKO,
			asset_code: 'OSMO',
			scanner_specific_code: 'osmosis',
		},
		{
			price_scanner_type: PriceScannerType.COIN_GECKO,
			asset_code: 'QCK',
			scanner_specific_code: 'quicksilver',
		},
		{
			price_scanner_type: PriceScannerType.COIN_GECKO,
			asset_code: 'RAY',
			scanner_specific_code: 'raydium',
		},
		{
			price_scanner_type: PriceScannerType.COIN_GECKO,
			asset_code: 'REBUS',
			scanner_specific_code: 'rebus',
		},
		{
			price_scanner_type: PriceScannerType.COIN_GECKO,
			asset_code: 'ROWAN',
			scanner_specific_code: 'sifchain',
		},
		{
			price_scanner_type: PriceScannerType.COIN_GECKO,
			asset_code: 'SCRT',
			scanner_specific_code: 'secret',
		},
		{
			price_scanner_type: PriceScannerType.COIN_GECKO,
			asset_code: 'SHIB',
			scanner_specific_code: 'shiba-inu',
		},
		{
			price_scanner_type: PriceScannerType.COIN_GECKO,
			asset_code: 'SOL',
			scanner_specific_code: 'solana',
		},
		{
			price_scanner_type: PriceScannerType.COIN_GECKO,
			asset_code: 'STRD',
			scanner_specific_code: 'stride',
		},
		{
			price_scanner_type: PriceScannerType.COIN_GECKO,
			asset_code: 'mSOL',
			scanner_specific_code: 'msol',
		},
		{
			price_scanner_type: PriceScannerType.COIN_GECKO,
			asset_code: 'wSOL',
			scanner_specific_code: 'wrapped-solana',
		},
		{
			price_scanner_type: PriceScannerType.COIN_GECKO,
			asset_code: 'STARS',
			scanner_specific_code: 'stargaze',
		},
		{
			price_scanner_type: PriceScannerType.COIN_GECKO,
			asset_code: 'USDC',
			scanner_specific_code: 'usd-coin',
		},
		{
			price_scanner_type: PriceScannerType.COIN_GECKO,
			asset_code: 'USDT',
			scanner_specific_code: 'tether',
		},
		{
			price_scanner_type: PriceScannerType.COIN_GECKO,
			asset_code: 'XRP',
			scanner_specific_code: 'ripple',
		},

		// LiveCoinWatch
		{
			price_scanner_type: PriceScannerType.LIVE_COIN_WATCH,
			asset_code: 'ADA',
			scanner_specific_code: 'ADA',
		},
		{
			price_scanner_type: PriceScannerType.LIVE_COIN_WATCH,
			asset_code: 'ALGO',
			scanner_specific_code: 'ALGO',
		},
		{
			price_scanner_type: PriceScannerType.LIVE_COIN_WATCH,
			asset_code: 'APT',
			scanner_specific_code: 'APT',
		},
		{
			price_scanner_type: PriceScannerType.LIVE_COIN_WATCH,
			asset_code: 'ATOM',
			scanner_specific_code: 'ATOM',
		},
		{
			price_scanner_type: PriceScannerType.LIVE_COIN_WATCH,
			asset_code: 'BNB',
			scanner_specific_code: 'BNB',
		},
		{
			price_scanner_type: PriceScannerType.LIVE_COIN_WATCH,
			asset_code: 'BTC',
			scanner_specific_code: 'BTC',
		},
		{
			price_scanner_type: PriceScannerType.LIVE_COIN_WATCH,
			asset_code: 'DOGE',
			scanner_specific_code: 'DOGE',
		},
		{
			price_scanner_type: PriceScannerType.LIVE_COIN_WATCH,
			asset_code: 'EGLD',
			scanner_specific_code: 'EGLD',
		},
		{
			price_scanner_type: PriceScannerType.LIVE_COIN_WATCH,
			asset_code: 'ETH',
			scanner_specific_code: 'ETH',
		},
		{
			price_scanner_type: PriceScannerType.LIVE_COIN_WATCH,
			asset_code: 'EVMOS',
			scanner_specific_code: 'EVMOS',
		},
		{
			price_scanner_type: PriceScannerType.LIVE_COIN_WATCH,
			asset_code: 'GLTO',
			scanner_specific_code: 'GLTO',
		},
		{
			price_scanner_type: PriceScannerType.LIVE_COIN_WATCH,
			asset_code: 'GMT',
			scanner_specific_code: 'GMT',
		},
		{
			price_scanner_type: PriceScannerType.LIVE_COIN_WATCH,
			asset_code: 'LDO',
			scanner_specific_code: 'LDO',
		},
		{
			price_scanner_type: PriceScannerType.LIVE_COIN_WATCH,
			asset_code: 'LUNA',
			scanner_specific_code: 'LUNA',
		},
		{
			price_scanner_type: PriceScannerType.LIVE_COIN_WATCH,
			asset_code: 'LUNC',
			scanner_specific_code: 'LUNC',
		},
		{
			price_scanner_type: PriceScannerType.LIVE_COIN_WATCH,
			asset_code: 'MATIC',
			scanner_specific_code: 'MATIC',
		},
		{
			price_scanner_type: PriceScannerType.LIVE_COIN_WATCH,
			asset_code: 'NEAR',
			scanner_specific_code: 'NEAR',
		},
		{
			price_scanner_type: PriceScannerType.LIVE_COIN_WATCH,
			asset_code: 'SOL',
			scanner_specific_code: 'SOL',
		},
		{
			price_scanner_type: PriceScannerType.LIVE_COIN_WATCH,
			asset_code: 'STRD',
			scanner_specific_code: 'STRD',
		},
		{
			price_scanner_type: PriceScannerType.LIVE_COIN_WATCH,
			asset_code: 'XRP',
			scanner_specific_code: 'XRP',
		},
	])
}
