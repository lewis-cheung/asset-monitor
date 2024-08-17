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

	await knex.schema.createTable('price_scanner_config_assets', t => {
		t.increments('id').primary()
		t.integer('price_scanner_type').notNullable()
		t.integer('asset_info_id').unsigned().notNullable().references('id').inTable('asset_infos').onDelete('CASCADE')
		t.string('scanner_specific_code', 255).notNullable()
		t.boolean('is_enabled').notNullable().defaultTo(true)
		t.string('remarks', 255)
		t.timestamp('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
		t.timestamp('updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))

		t.unique(['price_scanner_config_id', 'asset_info_id'])
	})
	knex.raw(getOnUpdateTriggerSql('asset_infos'))
}

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
	Model.knex(knex)

	await knex.schema.dropTableIfExists('price_scanner_config_assets')
	await knex.schema.dropTableIfExists('price_scanner_configs')
}
