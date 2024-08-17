export default class RippleNativeTokenScanner extends BaseRippleAssetScanner {
    /** @type {number} */ static assetDecimals: number;
    /** @protected @type {AssetInfo} */ protected nativeAssetInfo: AssetInfo;
}
import BaseRippleAssetScanner from "./base.js";
import { AssetInfo } from "../../models/index.js";
