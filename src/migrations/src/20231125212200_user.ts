/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely, sql } from "kysely";

const tableName = "user";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable(tableName)
    .addColumn("id", "bigint", (col) => col.primaryKey().autoIncrement())
    .addColumn("auth_key", "varchar(255)", (col) => col.unique().notNull())
    .addColumn("fullname", "varchar(255)", (col) => col.notNull())
    .addColumn("role", sql`ENUM('student', 'lecturer')`, (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable(tableName).execute();
}
