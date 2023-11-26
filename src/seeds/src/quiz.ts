import { Kysely } from "kysely";
import { Entities, Database } from "../../schema/database";
import { faker } from "@faker-js/faker";
import moment from "moment";

export async function seedQuiz(
  db: Kysely<Database>,
  seedData: {
    user: Entities["user"]["select"];
    bank_soal: Entities["bank_soal"]["select"][];
  }
): Promise<void> {
  console.log("Inserting sample quiz data to table...");

  const insertQuiz: Entities["quiz"]["insert"] = {
    description: faker.lorem.text(),
    start: moment().format("YYYY-MM-DD HH:mm:ss"),
    end: moment().add(6, "h").format("YYYY-MM-DD HH:mm:ss"),
    created_by: seedData.user.id,
  };
  const quizinserted = await db
    .insertInto("quiz")
    .values(insertQuiz)
    .executeTakeFirstOrThrow();

  const insertQuizSoal: Entities["quiz_soal"]["insert"][] =
    seedData.bank_soal.map((soal) => {
      return {
        quiz_id: Number(quizinserted.insertId),
        bank_soal_id: soal.id,
      };
    });

  await db.insertInto("quiz_soal").values(insertQuizSoal).execute();
}
