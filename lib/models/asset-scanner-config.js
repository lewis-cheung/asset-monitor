import BaseModel from './base.js'
import { schema } from '../utils/index.js'

export default class AssetScannerConfig extends BaseModel {
	static tableName = 'asset_scanner_configs'

	/** @type {import('objection').JSONSchema} */
	static get jsonSchema() {
		return {
			type: 'object',
			required: [
				'scanner_type',
				'chain',
			],
			properties: {
				id: schema.primaryIndex,
				scanner_type: schema.assetScannerType,
				chain: schema.chain,
				endpoint: { type: 'string', maxLength: 255 },
				api_key: { type: 'string', maxLength: 255 },
				rateLimiterKey: { type: 'string', maxLength: 255 },
				is_enabled: { type: 'boolean', default: true },
				created_at: schema.datetime,
			}
		}
	}
}

BaseModel.AssetScannerConfig = AssetScannerConfig