export default class AptosNativeTokenScanner extends BaseAptosAssetScanner {
    /** @type {number} */ static assetDecimals: number;
    /** @protected @type {AssetInfo} */ protected nativeAssetInfo: AssetInfo;
}
import BaseAptosAssetScanner from "./base.js";
import { AssetInfo } from "../../models/index.js";
