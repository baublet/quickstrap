import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("sshKeys", (table) => {
    table.increments();
    table.timestamps(undefined, true);

    table.string("userSource").notNullable();
    table.string("user").notNullable();
    table.string("fingerprint").notNullable().index();
    table.string("privateKey").notNullable();
    table.string("publicKey").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {}
