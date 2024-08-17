export default class AssetInfo extends BaseModel {
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
     * @param {enums.Chain} chain
     * @returns {Promise<AssetInfo>}
     */
    static getNativeToken(chain: enums.Chain): Promise<AssetInfo>;
    /**
     * @param {enums.Chain} chain
     * @returns {Promise<AssetInfo[]>}
     */
    static getSecondaryTokens(chain: enums.Chain): Promise<AssetInfo[]>;
    /**
     * @param {enums.Chain} chain
     * @returns {Promise<AssetInfo[]>}
     */
    static getCexTokens(chain: enums.Chain): Promise<AssetInfo[]>;
}
import BaseModel from "./base.js";
import * as enums from "../enums.js";
