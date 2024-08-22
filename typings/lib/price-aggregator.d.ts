export default class PriceAggregator {
    /** @protected @type {Map<enums.PriceScannerType, BasePriceScanner>} */ protected scannerByType: Map<enums.PriceScannerType, BasePriceScanner>;
    /** @protected @type {boolean} */ protected isInitialized: boolean;
    /**
     * @param {enums.PriceScannerType} type
     * @returns {BasePriceScanner}
     */
    getScanner(type: enums.PriceScannerType): BasePriceScanner;
    /**
     * @public
     */
    public init(): Promise<void>;
    /**
     * @public
     */
    public close(): Promise<void>;
    /**
     * @public
     * @param {types.AssetCode} code
     * @returns {Promise<number>}
     */
    public getPrice(code: types.AssetCode): Promise<number>;
    /**
     * @protected
     * @param {PriceScannerConfig} config
     */
    protected addPriceScanner(config: PriceScannerConfig): Promise<void>;
}
import * as enums from "./enums.js";
import { BasePriceScanner } from "./price-scanners/index.js";
import { PriceScannerConfig } from "./models/index.js";
