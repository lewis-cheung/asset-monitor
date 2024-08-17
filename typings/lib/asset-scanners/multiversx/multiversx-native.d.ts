export default class MultiversxNativeTokenScanner extends BaseMultiversxAssetScanner {
    /** @type {number} */ static assetDecimals: number;
    /** @protected @type {AssetInfo} */ protected nativeAssetInfo: AssetInfo;
}
import BaseMultiversxAssetScanner from "./base.js";
import { AssetInfo } from "../../models/index.js";
