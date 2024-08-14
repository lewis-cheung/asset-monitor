import BaseModel from './base.js'
import { schema } from '../utils/index.js'
import * as enums from '../enums.js'

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

	/**
	 * @param {enums.Chain} chain
	 * @returns {Promise<AssetInfo>}
	 */
	static async getNativeToken(chain) {
		return await this.query()
			.where('chain', chain)
			.where('type', enums.AssetType.NATIVE_TOKEN)
			.first()
	}

	/**
	 * @param {enums.Chain} chain
	 * @returns {Promise<AssetInfo[]>}
	 */
	static async getSecondaryTokens(chain) {
		return await this.query()
			.where('chain', chain)
			.where('type', enums.AssetType.SECONDARY_TOKEN)
	}

	/**
	 * @param {enums.Chain} chain
	 * @returns {Promise<AssetInfo[]>}
	 */
	static async getCexTokens(chain) {
		return await this.query()
			.where('chain', chain)
			.where('type', enums.AssetType.CEX_TOKEN)
	}
}

BaseModel.AssetInfo = AssetInfo