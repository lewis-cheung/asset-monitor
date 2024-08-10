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
		return {
			config: {
				relation: BaseModel.HasManyRelation,
				modelClass: BaseModel.AssetScannerConfigEndpoint,
				join: {
					from: `${this.tableName}.id`,
					to: `${BaseModel.AssetScannerConfigEndpoint.tableName}.config_id`,
				},
			},
		}
	}
}

BaseModel.AssetScannerConfig = AssetScannerConfig