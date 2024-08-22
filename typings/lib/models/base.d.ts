export default class BaseModel extends Model {
    /** @type {typeof import('./asset-flow').default} */
    static AssetFlow: typeof import('./asset-flow').default;
    /** @type {typeof import('./asset-group').default} */
    static AssetGroup: typeof import('./asset-group').default;
    /** @type {typeof import('./asset-info').default} */
    static AssetInfo: typeof import('./asset-info').default;
    /** @type {typeof import('./asset-query').default} */
    static AssetQuery: typeof import('./asset-query').default;
    /** @type {typeof import('./asset-scanner-config').default} */
    static AssetScannerConfig: typeof import('./asset-scanner-config').default;
    /** @type {typeof import('./asset-snapshot').default} */
    static AssetSnapshot: typeof import('./asset-snapshot').default;
    /** @type {typeof import('./asset-snapshot-batch').default} */
    static AssetSnapshotBatch: typeof import('./asset-snapshot-batch').default;
    /** @type {typeof import('./asset-snapshot-tag').default} */
    static AssetSnapshotTag: typeof import('./asset-snapshot-tag').default;
    /** @type {typeof import('./price-scanner-asset-info').default} */
    static PriceScannerAssetInfo: typeof import('./price-scanner-asset-info').default;
    /** @type {typeof import('./price-scanner-config').default} */
    static PriceScannerConfig: typeof import('./price-scanner-config').default;
}
import { Model } from "objection";
