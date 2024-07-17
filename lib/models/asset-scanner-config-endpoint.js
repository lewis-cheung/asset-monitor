import BaseModel from './base.js'
import { schema } from '../utils/index.js'

export default class AssetScannerConfigEndpoint extends BaseModel {
	static tableName = 'asset_scanner_config_endpoints'

	/** @type {import('objection').JSONSchema} */
	static get jsonSchema() {
		return {
			type: 'object',
			required: [
				'config_id',
				'endpoint',
			],
			properties: {
				id: schema.primaryIndex,
				config_id: schema.refId,
				endpoint: { type: 'string', maxLength: 255 },
				api_key: { type: 'string', maxLength: 255 },
				rate_limiter_key: { type: 'string', maxLength: 255 },
				is_enabled: { type: 'boolean', default: true },
				created_at: schema.datetime,
			}
		}
	}

	/** @type {import('objection').RelationMappings} */
	static get relationMappings() {
		return {
			config: {
				relation: BaseModel.BelongsToOneRelation,
				modelClass: BaseModel.AssetScannerConfig,
				join: {
					from: `${this.tableName}.config_id`,
					to: `${BaseModel.AssetScannerConfig.tableName}.id`,
				},
			},
		}
	}
}

BaseModel.AssetScannerConfigEndpoint = AssetScannerConfigEndpoint