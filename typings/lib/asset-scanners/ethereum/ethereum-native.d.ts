export default class EthereumNativeTokenScanner extends BaseEthereumAssetScanner {
    /** @type {number} */ static assetDecimals: number;
    /** @protected @type {AssetInfo} */ protected nativeAssetInfo: AssetInfo;
}
import BaseEthereumAssetScanner from "./base.js";
import { AssetInfo } from "../../models/index.js";
