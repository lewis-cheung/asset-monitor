export default class AlgorandNativeTokenScanner extends BaseAlgorandAssetScanner {
    /** @type {number} */ static assetDecimals: number;
    /** @protected @type {AssetInfo} */ protected nativeAssetInfo: AssetInfo;
}
import BaseAlgorandAssetScanner from "./base.js";
import { AssetInfo } from "../../models/index.js";
