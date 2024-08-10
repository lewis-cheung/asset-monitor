import { Model } from 'objection'

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
	Model.knex(knex)

	await knex.schema.createTable('asset_groups', t => {
		t.increments('id').primary()
		t.string('name', 255).notNullable().unique()
		t.timestamp('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
	})

	await knex.schema.createTable('asset_snapshot_batches', t => {
		t.increments('id').primary()
		t.timestamp('scan_started_at').notNullable()
		t.timestamp('scan_finished_at').notNullable().index()
	})

	await knex.schema.createTable('asset_snapshots', t => {
		t.increments('id').primary()
		t.integer('batch_id').notNullable().unsigned().index()
		t.integer('group_id').nullable().unsigned().index()
		t.string('code', 255).nullable().index()
		t.string('chain', 255).notNullable().index()
		t.string('type', 255).notNullable().index()
		t.string('name', 255).nullable().index()
		t.string('state', 255).notNullable().index()
		t.decimal('quantity', 36, 18).nullable()
		t.decimal('usd_value', 15, 6).notNullable()
		t.decimal('usd_value_per_quantity', 15, 6).nullable()
		t.string('account_id', 255).nullable()
		t.timestamp('captured_at').notNullable()

		t.foreign('batch_id')
			.references('id')
			.inTable('asset_snapshot_batches')
			.onDelete('CASCADE')
		t.foreign('group_id')
			.references('id')
			.inTable('asset_groups')
	})

	await knex.schema.createTable('asset_snapshot_tags', t => {
		t.increments('id').primary()
		t.integer('snapshot_id').notNullable().unsigned().index()
		t.string('category', 255).notNullable().index()
		t.string('value', 255).notNullable().index()

		t.unique(['snapshot_id', 'category'])
		t.foreign('snapshot_id')
			.references('id')
			.inTable('asset_snapshots')
			.onDelete('CASCADE')
	})

	await knex.schema.createTable('asset_flows', t => {
		t.increments('id').primary()
		t.integer('from_group_id').nullable().unsigned().index()
		t.integer('to_group_id').nullable().unsigned().index()
		t.decimal('usd_value', 15, 6).notNullable()
		t.timestamp('executed_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))

		t.foreign('from_group_id')
			.references('id')
			.inTable('asset_groups')
		t.foreign('to_group_id')
			.references('id')
			.inTable('asset_groups')
	})
}

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
	Model.knex(knex)
	await knex.schema.dropTableIfExists('asset_snapshot_tags')
	await knex.schema.dropTableIfExists('asset_snapshots')
	await knex.schema.dropTableIfExists('asset_snapshot_batches')
	await knex.schema.dropTableIfExists('asset_flows')
	await knex.schema.dropTableIfExists('asset_groups')
}
