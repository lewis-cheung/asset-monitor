export default class CardanoBlockfrostNativeTokenScanner extends BaseCardanoAssetScanner {
    /** @type {number} */ static assetDecimals: number;
    /** @protected @type {AssetInfo} */ protected nativeAssetInfo: AssetInfo;
}
import BaseCardanoAssetScanner from "./base.js";
import { AssetInfo } from "../../models/index.js";
