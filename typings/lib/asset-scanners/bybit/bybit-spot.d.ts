export default class BybitSpotAssetScanner extends BaseAssetScanner {
    /** @protected @type {AssetInfo[]} */ protected assetInfos: AssetInfo[];
    /** @protected @type {Map.<string, AssetInfo>} */ protected assetInfoByBybitSymbol: Map<string, AssetInfo>;
}
import BaseAssetScanner from "../base.js";
import { AssetInfo } from "../../models/index.js";
