export default class AssetMonitor {
    /**
     * @param {AssetMonitorOpts} [opts={}]
     */
    constructor(opts?: AssetMonitorOpts);
    /** @type {Map<string, Map<string, BaseAssetScanner>>} */ assetScannerByChainByType: Map<string, Map<string, BaseAssetScanner>>;
    /** @protected @type {PriceAggregator} */ protected priceAggregator: PriceAggregator;
    /** @protected @type {AssetMonitorTelegramBot} */ protected telegramBot: AssetMonitorTelegramBot;
    /** @protected @type {number[]} */ protected telegramNotiChatIds: number[];
    /**
     * @protected
     * @param {string} path
     * @param {object} [secretObj]
     * @returns {types.ScannersConfig | types.QueryConfig}
     */
    protected loadConfig(path: string, secretObj?: object): types.ScannersConfig | types.QueryConfig;
    /**
     * @param {string|string[]} content
     */
    sendTelegramNoti(content: string | string[]): Promise<void>;
    /**
     * @public
     * @returns {Promise<types.ScanResult>}
     */
    public scan(): Promise<types.ScanResult>;
    /**
     * @private
     * @return {Promise<Map<string, AssetScannerConfig[]>>}
     */
    private getAssetScannerConfigsMap;
    /**
     * @public
     * @param {types.AssetGroupSpecifier} fromGroupSpecifier
     * @param {types.AssetGroupSpecifier} toGroupSpecifier
     * @param {Decimal.Value} value
     * @param {object} [opts={}]
     * @param {Date} [opts.time]
     * @param {Transaction} [opts.trx]
     * @param {bool} [opts.createGroup=false] Create group if not exist
     * @returns {Promise<AssetFlow>}
     */
    public recordFlow(fromGroupSpecifier: types.AssetGroupSpecifier, toGroupSpecifier: types.AssetGroupSpecifier, value: Decimal.Value, opts?: {
        time?: Date;
        trx?: Transaction;
        createGroup?: bool;
    }): Promise<AssetFlow>;
    /**
     * @public
     * @param {string} [cronSchedule='0 * * * *']
     * @returns {Promise<void>}
     */
    public monitor(cronSchedule?: string): Promise<void>;
    /**
     * @public
     */
    public close(): Promise<void>;
    /**
     * @private
     * @param {AssetScannerConfig} config
     * @returns {Promise<BaseAssetScanner>}
     */
    private createAssetScanner;
    /**
     * @public
     * @param {types.PriceScannerConfig} config
     */
    public addPriceScanner(config: types.PriceScannerConfig): void;
    /**
     * @protected
     * @param {types.ScannersConfig} config
     */
    protected setupScanners(config: types.ScannersConfig): void;
}
export type AssetMonitorOpts = {
    scannerConfigPath?: string;
    queryConfigPath?: string;
    secretsPath?: string;
};
import { BaseAssetScanner } from "./asset-scanners/index.js";
import PriceAggregator from "./price-aggregator.js";
import AssetMonitorTelegramBot from "./telegram-bot.js";
import * as types from "./types.js";
import Decimal from "decimal.js";
import { AssetFlow } from "./models/index.js";
