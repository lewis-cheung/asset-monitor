import BaseModel from './base.js'
import { schema } from '../utils/index.js'

export default class AssetScannerConfig extends BaseModel {
	static tableName = 'asset_scanner_configs'

	/** @type {import('objection').JSONSchema} */
	static get jsonSchema() {
		return {
			type: 'object',
			required: [
				'type',
				'chain',
			],
			properties: {
				id: schema.primaryIndex,
				chain: schema.chain,
				type: schema.assetScannerType,
				endpoint: { type: 'string', maxLength: 255 },
				api_key: { type: 'string', maxLength: 255 },
				rate_limiter_key: { type: 'string', maxLength: 255 },
				is_enabled: { type: 'boolean', default: true },
				created_at: schema.datetime,
				updated_at: schema.datetime,
			}
		}
	}

	/** @type {import('objection').RelationMappings} */
	static get relationMappings() {
		return {}
	}

	static get modifiers() {
		return {
			/**
			 * @param {import('objection').QueryBuilder} query
			 */
			isEnabled(query) {
				query.where('is_enabled', true)
			}
		}
	}

	/**
	 * @param {string} type
	 * @param {string} chain
	 * @returns {string}
	 */
	static getScannerIdentifier(type, chain) {
		return `${type}:${chain}`
	}

	/**
	 * 
	 * @param {object} [opts={}]
	 * @param {bool} [opts.isEnabled=true]
	 * @returns {Promise<AssetScannerConfig[]>}
	 */
	static async getAll(opts = {}) {
		const query = this.query()
		if (opts?.isEnabled == undefined || opts?.isEnabled) {
			query.modify('isEnabled')
		}
		return query
	}

	/**
	 * @returns {string} a key to identify type and chain
	 */
	get scannerIdentifier() {
		return AssetScannerConfig.getScannerIdentifier(this.type, this.chain)
	}

	/**
	 * @returns {string}
	 */
	toString() {
		// TODO: mask endpoint and api key
		return `${this.type}:${this.chain}:${this.endpoint}`
	}
}

BaseModel.AssetScannerConfig = AssetScannerConfig