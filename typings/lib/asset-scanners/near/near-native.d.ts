export default class NearNativeTokenScanner extends BaseNearAssetScanner {
    /** @type {number} */ static assetDecimals: number;
    /** @protected @type {AssetInfo} */ protected nativeAssetInfo: AssetInfo;
}
import BaseNearAssetScanner from "./base.js";
import { AssetInfo } from "../../models/index.js";
