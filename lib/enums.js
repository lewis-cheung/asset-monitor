/**
 * @enum {string}
 */
export const AssetType = {
    CEX_TOKEN: 'cex-token',
    NATIVE_TOKEN: 'native-token',
    SECONDARY_TOKEN: 'secondary-token',
    NFT: 'nft',
    OTHERS: 'others',
}

/**
 * @enum {string}
 */
export const AssetState = {
    CLAIMABLE: 'claimable',
    LIQUID: 'liquid',
    LOCKED: 'locked',
}

/**
 * @enum {string}
 */
export const AssetScannerType = {
    ALGORAND_NATIVE: 'algorand-native',
    APTOS_NATIVE: 'aptos-native',
    BITCOIN_BLOCKCHAIR_NATIVE: 'bitcoin-blockchair-native',
    BYBIT_SPOT: 'bybit-spot',
    CARDANO_BLOCKFROST_NATIVE: 'cardano-blockfrost-native',
    COSMOS_NATIVE: 'cosmos-native',
    COSMOS_SECONDARY: 'cosmos-secondary',
    ETHEREUM_NATIVE: 'ethereum-native',
    ETHEREUM_SECONDARY: 'ethereum-secondary',
    MULTIVERSX_NATIVE: 'multiversx-native',
    NEAR_NATIVE: 'near-native',
    RIPPLE_NATIVE: 'ripple-native',
    SOLANA_NATIVE: 'solana-native',
    SOLANA_SECONDARY: 'solana-secondary',
    ORCA_WHIRLPOOL: 'orca-whirlpool',
}

/**
 * @enum {string}
 */
export const Chain = {
    ALGORAND: 'algorand',
    APTOS: 'aptos',
    AVALANCHE_C: 'avalanche-c',
    BITCOIN: 'bitcoin',
    BYBIT: 'bybit',
    CARDANO: 'cardano',
    COMDEX: 'comdex',
    COSMOS_HUB: 'cosmos-hub',
    DYMENSION: 'dymension',
    ETHEREUM: 'ethereum',
    EVMOS: 'evmos',
    JUNO: 'juno',
    MATIC: 'matic',
    MULTIVERSX: 'multiversx',
    NEAR: 'near',
    OSMOSIS: 'osmosis',
    QUICKSILVER: 'quicksilver',
    REBUS: 'rebus',
    RIPPLE: 'ripple',
    SECRET_NETWORK: 'secret-network',
    SIFCHAIN: 'sifchain',
    SOLANA: 'solana',
    STARGAZE: 'stargaze',
    STRIDE: 'stride',
}

/**
 * @enum {string}
 */
export const DefaultAssetTagCategory = {
    DAPP: 'dapp',
    WALLET_TYPE: 'wallet-type',
}

/**
 * @enum {string}
 */
export const PriceScannerType = {
    COIN_GECKO: 'coin-gecko',
    LIVE_COIN_WATCH: 'live-coin-watch',
}