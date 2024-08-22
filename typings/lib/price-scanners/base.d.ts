export default class BasePriceScanner extends BaseService {
    /**
     * @param {PriceScannerConfig} config
     * @param {RateLimiterOpts} rateLimiterOpts
     */
    constructor(config: PriceScannerConfig, rateLimiterOpts?: RateLimiterOpts);
    /** @protected @type {PriceScannerConfig} */ protected config: PriceScannerConfig;
    /** @protected @type {Map.<string, PriceScannerAssetInfo>} */ protected scannerAssetInfoByCode: Map<string, PriceScannerAssetInfo>;
    /**
     * @public
     * @param {types.AssetCode} code
     * @return {Promise<number>}
     */
    public getPrice(code: types.AssetCode): Promise<number>;
    /**
     * @protected
     * @abstract
     * @param {types.AssetCode} code
     * @return {Promise<number>}
     */
    protected _getPrice(code: types.AssetCode): Promise<number>;
}
export type RateLimiterOpts = import('rate-limiter').RateLimiterOpts;
import { BaseService } from "../utils/index.js";
import { PriceScannerConfig } from "../models/index.js";
import { PriceScannerAssetInfo } from "../models/index.js";
