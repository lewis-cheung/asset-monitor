export default class AssetScannerConfig extends BaseModel {
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
     * @param {string} type
     * @param {string} chain
     * @returns {string}
     */
    static getScannerIdentifier(type: string, chain: string): string;
    /**
     *
     * @param {object} [opts={}]
     * @param {bool} [opts.isEnabled=true]
     * @returns {Promise<AssetScannerConfig[]>}
     */
    static getAll(opts?: {
        isEnabled?: bool;
    }): Promise<AssetScannerConfig[]>;
    /** @returns {string} */
    get apiKey(): string;
    /** @returns {string} */
    get rateLimiterKey(): string;
    /** @returns {string} a key to identify type and chain */
    get scannerIdentifier(): string;
}
import BaseModel from "./base.js";
