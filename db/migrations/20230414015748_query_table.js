import { Model } from 'objection'
import { createOnUpdateTriggerSql } from '../helpers.js'

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
	Model.knex(knex)

	// create asset query table
	await knex.schema.createTable('asset_queries', t => {
		t.increments('id')
		t.string('scanner_type', 255).notNullable()
		t.string('chain', 255).notNullable()
		t.string('address', 255)
		t.integer('group_id').unsigned()
		t.string('api_key', 255)
		t.string('api_secret', 255)
		t.jsonb('extra_tag_map').defaultTo('{}').notNullable()
		t.boolean('is_enabled').defaultTo(true).notNullable()
		t.timestamps(true, true)

		t.foreign('group_id')
			.references('id')
			.inTable('asset_groups')
	})
	await knex.raw(createOnUpdateTriggerSql('asset_queries'))

	// add is_default column to asset group table and set default group to default
	await knex.schema.alterTable('asset_groups', t => {
		t.boolean('is_default').defaultTo(false).notNullable()
	})
	await knex('asset_groups').update({ is_default: true }).where({ name: 'default' })

	// add tag_map and query_id column to asset snapshot table, migrate data from asset snapshot tag table and drop asset snapshot tag table
	await knex.schema.alterTable('asset_snapshots', t => {
		t.jsonb('tag_map').defaultTo('{}').notNullable()
		t.integer('query_id').unsigned()
		t.timestamp('captured_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP')).alter()
		t.foreign('query_id')
			.references('id')
			.inTable('asset_queries')
			.onDelete('SET NULL')
	})
	await knex.raw(`
		UPDATE asset_snapshots
		SET tag_map = (
			SELECT jsonb_object_agg(t.category, t.value)
			FROM asset_snapshot_tags t
			WHERE t.snapshot_id = asset_snapshots.id
		)
	`)
	await knex.schema.dropTable('asset_snapshot_tags')
}

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
	Model.knex(knex)

	await knex.schema.alterTable('asset_groups', t => {
		t.dropColumn('is_default')
	})

	await knex.schema.alterTable('asset_snapshots', t => {
		t.dropForeign('query_id')
		t.dropColumns(['tag_map', 'query_id'])
		t.timestamp('captured_at').notNullable().alter()
	})
	await knex.schema.createTable('asset_snapshot_tags', t => {
		t.increments('id')
		t.integer('snapshot_id').unsigned().notNullable()
		t.string('name', 255).notNullable()
		t.string('value', 255).notNullable()
		t.timestamps(true, true)

		t.foreign('snapshot_id')
			.references('id')
			.inTable('asset_snapshots')
	})
	await knex.schema.dropTable('asset_queries')
}
