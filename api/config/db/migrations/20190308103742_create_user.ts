import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
    await knex.schema.createTable('users', (table) => {
        table.increments('id')
        table.string('name')
        table.string('email')
        table.string('password')
        table.enu('role', ['user', 'admin', 'su']).defaultTo('user')
        table.string('application')
        table.boolean('active').defaultTo(false)
        table.timestamp('createdAt').defaultTo(knex.fn.now())
        table.timestamp('updatedAt').defaultTo(knex.fn.now())
        table.timestamp('lastLogin').defaultTo(knex.fn.now())
    })
};


export async function down(knex: Knex): Promise<any> {
    await knex.schema.dropTable('users')
};



