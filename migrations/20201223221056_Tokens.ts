import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("tokens", (table) => {
    table.text("id").primary();
    table.timestamps(undefined, true);

    table.text("token").notNullable().unique().index();
    table.boolean("used").defaultTo("false").index();
    table.dateTime("expires").notNullable().index();
  });
}

export async function down(knex: Knex): Promise<void> {}
