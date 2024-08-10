import { Model } from 'objection'

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
	Model.knex(knex)

	// create asset query table
	await knex.schema.createTable('asset_scanner_configs', t => {
		t.increments('id').primary()
		t.string('chain', 255).notNullable()
		t.string('type', 255).notNullable()
		t.string('endpoint', 255).notNullable()
		t.string('api_key', 255)
		t.string('rate_limiter_key', 255)
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

	await knex.schema.dropTableIfExists('asset_scanner_configs')
}
