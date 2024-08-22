export default class PriceScannerAssetInfo extends BaseModel {
    /** @type {import('objection').JSONSchema} */
    static get jsonSchema(): import("objection").JSONSchema;
    /** @type {import('objection').RelationMappings} */
    static get relationMappings(): import("objection").RelationMappings;
    static get modifiers(): {
        /**
         * @param {import('objection').QueryBuilder} query
         */
        isEnabled(query: import("objection").QueryBuilder<any, any[]>): void;
    };
    /**
     * @param {enums.PriceScannerType} type
     * @param {object} [opts={}]
     * @param {bool} [opts.isEnabled=true]
     * @returns {Promise<AssetScannerConfig[]>}
     */
    static getAllByScannerType(type: enums.PriceScannerType, opts?: {
        isEnabled?: bool;
    }): Promise<AssetScannerConfig[]>;
    /** @returns {types.AssetCode} */
    get assetCode(): string;
    /** @returns {string} */
    get scannerSpecificCode(): string;
    /** @returns {string} */
    get rateLimiterKey(): string;
}
import BaseModel from "./base.js";
import * as enums from "../enums.js";
