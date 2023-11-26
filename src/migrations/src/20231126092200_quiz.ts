/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely, sql } from "kysely";

const tableName = "quiz";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable(tableName)
    .addColumn("id", "bigint", (col) => col.primaryKey().autoIncrement())
    .addColumn("description", "text")
    .addColumn("start", "timestamp", (col) => col.notNull())
    .addColumn("end", "timestamp", (col) => col.notNull())
    .addColumn("created_by", "bigint", (col) =>
      col.notNull().references("user.id")
    )
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
