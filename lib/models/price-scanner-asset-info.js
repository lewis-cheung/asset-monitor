import BaseModel from './base.js'
import * as enums from '../enums.js'
import { schema } from '../utils/index.js'

export default class PriceScannerAssetInfo extends BaseModel {
	static tableName = 'price_scanner_asset_infos'

	/** @type {import('objection').JSONSchema} */
	static get jsonSchema() {
		return {
			type: 'object',
			required: [
				'price_scanner_type',
				'asset_code',
				'scanner_specific_code',
			],
			properties: {
				id: schema.primaryIndex,
				price_scanner_type: schema.priceScannerType,
				asset_info_id: schema.assetCode,
				scanner_specific_code: { type: 'string', maxLength: 255 },
				is_enabled: { type: 'boolean', default: true },
				remarks: { type: 'string', maxLength: 255 },
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
	 * @param {enums.PriceScannerType} type
	 * @param {object} [opts={}]
	 * @param {bool} [opts.isEnabled=true]
	 * @returns {Promise<AssetScannerConfig[]>}
	 */
	static async getAllByScannerType(type, opts = {}) {
		const query = this.query().where('price_scanner_type', type)
		if (opts?.isEnabled == undefined || opts?.isEnabled) {
			query.modify('isEnabled')
		}
		return query
	}

	/** @returns {string} */
	get scannerSpecificCode () { return this.scanner_specific_code }
	/** @returns {string} */
	get rateLimiterKey () { return this.rate_limiter_key }
}

BaseModel.AssetScannerConfig = AssetScannerConfig