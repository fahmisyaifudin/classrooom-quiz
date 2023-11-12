/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely } from "kysely";

const tableName = "bank_soal_answer";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable(tableName)
    .addColumn("id", "bigint", (col) => col.primaryKey().autoIncrement())
    .addColumn("bank_soal_id", "bigint", (col) =>
      col.notNull().references("bank_soal.id")
    )
    .addColumn("answer", "varchar(255)", (col) => col.notNull())
    .addColumn("is_correct", "boolean", (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable(tableName).execute();
}
