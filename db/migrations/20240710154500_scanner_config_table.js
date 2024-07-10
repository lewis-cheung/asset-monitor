import { Model } from 'objection'
import { AssetScannerConfig } from '../../lib/models/index.js'

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
	Model.knex(knex)

	// create asset query table
	await knex.schema.alterTable(AssetScannerConfig.tableName, t => {
		t.increments('id').primary()
		t.string('scanner_type', 255).notNullable()
		t.string('chain', 255).notNullable()
		t.string('endpoint', 255)
		t.string('api_key', 255)
		t.string('rateLimiterKey', 255)
		t.boolean('is_enabled').notNullable().defaultTo(true)
		t.timestamp('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
	})
}

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
	Model.knex(knex)

	
}
