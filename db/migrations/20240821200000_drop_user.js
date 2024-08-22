import { createOnUpdateTriggerSql } from '../helpers.js'

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
	await knex.schema.dropTableIfExists('users')
}

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
	await knex.schema.createTable('users', t => {
		t.increments('id')
		t.string('name', 255).notNullable().unique()
		t.string('hashed_password', 128).notNullable()
		t.enum('role', ['viewer', 'owner', 'editor']).notNullable().defaultTo('viewer')
		t.timestamp('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
		t.timestamp('updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
		t.timestamp('last_login_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
	})

	await knex.raw(createOnUpdateTriggerSql('users'))
}
