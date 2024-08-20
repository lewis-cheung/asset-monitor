import BaseModel from './base.js'
import { schema } from '../utils/index.js'

export default class PriceScannerConfig extends BaseModel {
	static tableName = 'price_scanner_configs'

	/** @type {import('objection').JSONSchema} */
	static get jsonSchema() {
		return {
			type: 'object',
			required: [
				'type',
			],
			properties: {
				id: schema.primaryIndex,
				type: schema.priceScannerType,
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

	/** @returns {string} */
	get apiKey () { return this.api_key }
	/** @returns {string} */
	get rateLimiterKey () { return this.rate_limiter_key }
}

BaseModel.AssetScannerConfig = AssetScannerConfig