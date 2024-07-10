/**
 * @typedef {import('./base').AssetInfoMap} AssetInfoMap
 */

import { AssetScannerType } from '../enums.js'
import BaseAssetScanner from './base.js'
import * as algorand from './algorand/index.js'
import * as aptos from './aptos/index.js'
import * as bitcoin from './bitcoin/index.js'
import * as bybit from './bybit/index.js'
import * as cardano from './cardano/index.js'
import * as cosmos from './cosmos/index.js'
import * as ethereum from './ethereum/index.js'
import * as multiversx from './multiversx/index.js'
import * as near from './near/index.js'
import * as ripple from './ripple/index.js'
import * as solana from './solana/index.js'

/**
 * @type {object.<AssetScannerType, typeof BaseAssetScanner>}
 */
export const ScannerClassByType = {
	// Algorand
	[AssetScannerType.ALGORAND_NATIVE]: algorand.AlgorandNativeTokenScanner,
	// Aptos
	[AssetScannerType.APTOS_NATIVE]: aptos.AptosNativeTokenScanner,
	// Bitcoin
	[AssetScannerType.BITCOIN_BLOCKCHAIR_NATIVE]: bitcoin.BitcoinBlockchairNativeTokenScanner,
	// Bybit
	[AssetScannerType.BYBIT_SPOT]: bybit.BybitSpotAssetScanner,
	// Cardano
	[AssetScannerType.CARDANO_BLOCKFROST_NATIVE]: cardano.CardanoBlockfrostNativeTokenScanner,
	// Cosmos
	[AssetScannerType.COSMOS_NATIVE]: cosmos.CosmosNativeTokenScanner,
	[AssetScannerType.COSMOS_SECONDARY]: cosmos.CosmosSecondaryTokenScanner,
	// Ethereum
	[AssetScannerType.ETHEREUM_NATIVE]: ethereum.EthereumNativeTokenScanner,
	[AssetScannerType.ETHEREUM_SECONDARY]: ethereum.EthereumSecondaryTokenScanner,
	// Multiversx
	[AssetScannerType.MULTIVERSX_NATIVE]: multiversx.MultiversxNativeTokenScanner,
	// Near
	[AssetScannerType.NEAR_NATIVE]: near.NearNativeTokenScanner,
	// Ripple
	[AssetScannerType.RIPPLE_NATIVE]: ripple.RippleNativeTokenScanner,
	// Solana
	[AssetScannerType.SOLANA_NATIVE]: solana.SolanaNativeTokenScanner,
	[AssetScannerType.SOLANA_SECONDARY]: solana.SolanaSecondaryTokenScanner,
	[AssetScannerType.ORCA_WHIRLPOOL]: solana.OrcaWhirlpoolScanner,
}

export { default as BaseAssetScanner } from './base.js'
export * from './algorand/index.js'
export * from './aptos/index.js'
export * from './bybit/index.js'
export * from './bitcoin/index.js'
export * from './cardano/index.js'
export * from './cosmos/index.js'
export * from './ethereum/index.js'
export * from './multiversx/index.js'
export * from './ripple/index.js'
export * from './solana/index.js'
