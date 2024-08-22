import { Model } from 'objection'
import * as enums from '../../lib/enums.js'
import { createOnUpdateTriggerSql } from '../helpers.js'

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
	Model.knex(knex)

	await knex.raw(`
		CREATE OR REPLACE FUNCTION on_update_timestamp()
		RETURNS trigger AS $$
		BEGIN
			NEW.updated_at = now();
			RETURN NEW;
		END;
		$$ language 'plpgsql';
	`)

	await knex.schema.createTable('users', t => {
		t.increments('id')
		t.string('name', 255).notNullable().unique()
		t.string('hashed_password', 128).notNullable()
		t.enum('role', Object.values(enums.UserRole)).notNullable().defaultTo(enums.UserRole.VIEWER)
		t.timestamp('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
		t.timestamp('updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
		t.timestamp('last_login_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
	})

	await knex.raw(createOnUpdateTriggerSql('users'))
}

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
	Model.knex(knex)

	await knex.schema.dropTableIfExists('users')
	await knex.raw(`DROP FUNCTION on_update_timestamp`)
}
