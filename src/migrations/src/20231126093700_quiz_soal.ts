/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely, sql } from "kysely";

const tableName = "quiz_soal";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable(tableName)
    .addColumn("id", "bigint", (col) => col.primaryKey().autoIncrement())
    .addColumn("quiz_id", "bigint", (col) =>
      col.notNull().references("quiz.id")
    )
    .addColumn("bank_soal_id", "bigint", (col) =>
      col.notNull().references("bank_soal.id")
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable(tableName).execute();
}
