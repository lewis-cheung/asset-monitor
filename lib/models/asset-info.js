import BaseModel from './base.js'
import { schema } from '../utils/index.js'

export default class AssetInfo extends BaseModel {
	static tableName = 'asset_infos'

	/** @type {import('objection').JSONSchema} */
	static get jsonSchema() {
		return {
			type: 'object',
			required: [
				'chain',
				'code',
				'type',
			],
			properties: {
				id: schema.primaryIndex,
				chain: schema.chain,
				code: schema.assetCode,
				type: schema.assetType,
				address: { type: 'string', maxLength: 255 },
				created_at: schema.datetime,
				updated_at: schema.datetime,
			}
		}
	}

	/** @type {import('objection').RelationMappings} */
	static get relationMappings() {
		return {}
	}
}

BaseModel.AssetInfo = AssetInfo