export default class BaseNearAssetScanner extends BaseAssetScanner {
    /** @type {nearAPI.Near} */ client: nearAPI.Near;
}
import BaseAssetScanner from "../base.js";
import * as nearAPI from "near-api-js";
