export default class OrcaWhirlpoolScanner extends BaseSolanaAssetScanner {
    /** @type {WhirlpoolContext} */ ctx: WhirlpoolContext;
    /** @type {WhirlpoolClient} */ client: WhirlpoolClient;
    /** @type {AccountFetcher} */ accFetcher: AccountFetcher;
    /** @type {AssetInfo[]} */ assetInfos: AssetInfo[];
    /** @type {Map.<string, AssetInfo>} */ assetInfoByAddr: Map<string, AssetInfo>;
}
export type WhirlpoolClient = import('@orca-so/whirlpools-sdk').WhirlpoolClient;
export type CollectFeesQuoteParam = import('@orca-so/whirlpools-sdk').CollectFeesQuoteParam;
export type CollectRewardsQuoteParam = import('@orca-so/whirlpools-sdk').CollectRewardsQuoteParam;
import BaseSolanaAssetScanner from "./base.js";
import { WhirlpoolContext } from "@orca-so/whirlpools-sdk/dist/context.js";
import { AccountFetcher } from "@orca-so/whirlpools-sdk/dist/network/public/fetcher.js";
import { AssetInfo } from "../../models/index.js";
