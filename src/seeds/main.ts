import { createPool } from "mysql2";
import { Kysely, MysqlDialect } from "kysely";
import { Database } from "../schema/database";
import { seedStudent } from "./src/student";
import { seedBankSoal } from "./src/bank-soal";
import { seedUser } from "./src/user";
import { seedQuiz } from "./src/quiz";

require("dotenv").config();

seedInitialData();

export async function seedInitialData() {
  const dialect = new MysqlDialect({
    pool: createPool({
      database: process.env["DATABASE_NAME"],
      host: process.env["DATABASE_HOST"],
      user: process.env["DATABASE_USER"],
      password: process.env["DATABASE_PASSWORD"],
      port: 3306,
    }),
  });
  const db = new Kysely<Database>({
    dialect,
  });

  console.log("Seeding student data...");
  await seedStudent(db);
  const user = await seedUser(db);
  const bankSoal = await seedBankSoal(db);

  await seedQuiz(db, { user, bank_soal: bankSoal });

  await db.destroy();
}
