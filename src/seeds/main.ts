import { createPool } from "mysql2";
import { Kysely, MysqlDialect } from "kysely";
import { Database } from "../schema/database";
import { seedStudent } from "./src/student";
import { seedBankSoal } from "./src/bank-soal";
import { seedUser } from "./src/user";
import { seedQuiz } from "./src/quiz";

seedInitialData();

export async function seedInitialData() {
  const dialect = new MysqlDialect({
    pool: createPool({
      database: "classroom-quiz",
      host: "localhost",
      user: "mysql",
      password: "mysql",
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
