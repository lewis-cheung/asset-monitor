import { Model } from 'objection'

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
	Model.knex(knex)

	// create asset query table
	await knex.schema.alterTable('asset_flows', t => {
		t.decimal('invested_usd_value', 15, 6).notNullable().defaultTo(0)
		t.decimal('actual_usd_value', 15, 6).notNullable().defaultTo(0)
	})

	// assign usd_value to actual_usd_value and invested_usd_value
	await knex.raw(`
		UPDATE asset_flows
		SET actual_usd_value = usd_value, invested_usd_value = usd_value
	`)

	// drop usd_value column
	await knex.schema.alterTable('asset_flows', t => {
		t.dropColumn('usd_value')
	})
}

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
	Model.knex(knex)

	// create usd_value column
	await knex.schema.alterTable('asset_flows', t => {
		t.decimal('usd_value', 15, 6).notNullable().defaultTo(0)
	})

	// assign actual_usd_value to usd_value
	await knex.raw(`
		UPDATE asset_flows
		SET usd_value = actual_usd_value
	`)

	// drop actual_usd_value and invested_usd_value column
	await knex.schema.alterTable('asset_flows', t => {
		t.dropColumn('actual_usd_value')
		t.dropColumn('invested_usd_value')
	})
}
