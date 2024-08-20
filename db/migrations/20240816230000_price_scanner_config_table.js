import { Model } from 'objection'

import { getOnUpdateTriggerSql } from '../../lib/index.js'

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
	Model.knex(knex)

	await knex.schema.createTable('price_scanner_configs', t => {
		t.increments('id').primary()
		t.string('type', 255).notNullable()
		t.string('endpoint', 255)
		t.string('api_key', 255)
		t.string('rate_limiter_key', 255)
		t.boolean('is_enabled').notNullable().defaultTo(true)
		t.timestamp('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
		t.timestamp('updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
	})
	knex.raw(getOnUpdateTriggerSql('asset_scanner_configs'))

	await knex.schema.createTable('price_scanner_asset_infos', t => {
		t.increments('id').primary()
		t.string('price_scanner_type', 255).notNullable()
		t.string('asset_code', 255).notNullable()
		t.string('scanner_specific_code', 255).notNullable()
		t.boolean('is_enabled').notNullable().defaultTo(true)
		t.string('remarks', 255)
		t.timestamp('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
		t.timestamp('updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))

		t.unique(['price_scanner_type', 'asset_code'])
		t.unique(['price_scanner_type', 'scanner_specific_code'])
	})
	knex.raw(getOnUpdateTriggerSql('asset_infos'))
}

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
	Model.knex(knex)

	await knex.schema.dropTableIfExists('price_scanner_asset_infos')
	await knex.schema.dropTableIfExists('price_scanner_configs')
}
