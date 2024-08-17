export default class SolanaSecondaryTokenScanner extends BaseSolanaAssetScanner {
    /** @type {AssetInfo[]} */ assetInfos: AssetInfo[];
    /** @type {Map.<string, AssetInfo>} */ assetInfoByAddr: Map<string, AssetInfo>;
}
import BaseSolanaAssetScanner from "./base.js";
import { AssetInfo } from "../../models/index.js";
