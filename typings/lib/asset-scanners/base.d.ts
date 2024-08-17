export default class BaseAssetScanner extends BaseService {
    /** @protected @type {string[]} */ protected static requiredQueryKeys: string[];
    /**
     * @param {PriceAggregator} priceAggregator
     * @param {AssetScannerConfig} config
     */
    constructor(priceAggregator: PriceAggregator, config: AssetScannerConfig);
    /** @type {enums.Chain} */ chain: enums.Chain;
    /** @protected @type {PriceAggregator} */ protected priceAggregator: PriceAggregator;
    /** @protected @type {AssetScannerConfig} */ protected config: AssetScannerConfig;
    /**
     * @public
     * @param {AssetQuery} query
     * @returns {Promise<AssetSnapshot[]>}
     */
    public query(query: AssetQuery): Promise<AssetSnapshot[]>;
    /**
     * @protected
     * @abstract
     * @param {AssetQuery} assetQuery
     * @returns {Promise<AssetSnapshot[]>}
     */
    protected _query(assetQuery: AssetQuery): Promise<AssetSnapshot[]>;
}
export type RateLimiterOpts = import('rate-limiter').RateLimiterOpts;
export type ServiceParamDict = import('../utils').ServiceParamDict;
import { BaseService } from "../utils/index.js";
import * as enums from "../enums.js";
import PriceAggregator from "../price-aggregator.js";
import { AssetScannerConfig } from "../models/index.js";
import { AssetQuery } from "../models/index.js";
import { AssetSnapshot } from "../models/index.js";
