export type AssetType = string;
export namespace AssetType {
    const CEX_TOKEN: string;
    const NATIVE_TOKEN: string;
    const SECONDARY_TOKEN: string;
    const NFT: string;
    const OTHERS: string;
}
export type AssetState = string;
export namespace AssetState {
    const CLAIMABLE: string;
    const LIQUID: string;
    const LOCKED: string;
}
export type AssetScannerType = string;
export namespace AssetScannerType {
    const ALGORAND_NATIVE: string;
    const APTOS_NATIVE: string;
    const BITCOIN_BLOCKCHAIR_NATIVE: string;
    const BYBIT_SPOT: string;
    const CARDANO_BLOCKFROST_NATIVE: string;
    const COSMOS_NATIVE: string;
    const COSMOS_SECONDARY: string;
    const ETHEREUM_NATIVE: string;
    const ETHEREUM_SECONDARY: string;
    const MULTIVERSX_NATIVE: string;
    const NEAR_NATIVE: string;
    const RIPPLE_NATIVE: string;
    const SOLANA_NATIVE: string;
    const SOLANA_SECONDARY: string;
    const ORCA_WHIRLPOOL: string;
}
export type Chain = string;
export namespace Chain {
    const ALGORAND: string;
    const APTOS: string;
    const AVALANCHE_C: string;
    const BITCOIN: string;
    const BYBIT: string;
    const CARDANO: string;
    const COMDEX: string;
    const COSMOS_HUB: string;
    const DYMENSION: string;
    const ETHEREUM: string;
    const EVMOS: string;
    const JUNO: string;
    const MATIC: string;
    const MULTIVERSX: string;
    const NEAR: string;
    const OSMOSIS: string;
    const QUICKSILVER: string;
    const REBUS: string;
    const RIPPLE: string;
    const SECRET_NETWORK: string;
    const SIFCHAIN: string;
    const SOLANA: string;
    const STARGAZE: string;
    const STRIDE: string;
}
export type DefaultAssetTagCategory = string;
export namespace DefaultAssetTagCategory {
    const DAPP: string;
    const WALLET_TYPE: string;
}
export type PriceScannerType = string;
export namespace PriceScannerType {
    const COIN_GECKO: string;
    const LIVE_COIN_WATCH: string;
}
export type UserRole = string;
export namespace UserRole {
    const OWNER: string;
    const OPERATOR: string;
    const VIEWER: string;
}
