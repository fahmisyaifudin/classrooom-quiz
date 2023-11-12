import { Kysely } from "kysely";
import { Entities, Database } from "../../schema/database";
import { faker } from "@faker-js/faker";

export async function seedBankSoal(db: Kysely<Database>): Promise<void> {
  console.log("Inserting sample soal data to table...");

  const insertTopic: Entities["topic"]["insert"][] = Array(5)
    .fill(null)
    .map(() => {
      return {
        name: faker.word.noun(),
      };
    });

  await db.insertInto("topic").values(insertTopic).execute();
  const topic = await db.selectFrom("topic").selectAll().execute();

  const insertBankSoal: Entities["bank_soal"]["insert"][] = Array(10)
    .fill(null)
    .map(() => {
      return {
        question: faker.lorem.sentence(),
      };
    });

  await db.insertInto("bank_soal").values(insertBankSoal).execute();
  const bankSoal = await db.selectFrom("bank_soal").selectAll().execute();

  for (const soal of bankSoal) {
    const randomKeyTopic = Math.floor(Math.random() * topic.length);
    const insertAnswer: Entities["bank_soal_answer"]["insert"][] = Array(4)
      .fill(null)
      .map((item, i) => {
        return {
          bank_soal_id: soal.id,
          answer: faker.lorem.word(),
          is_correct: i == 0 ? true : false,
        };
      });
    await db.insertInto("bank_soal_answer").values(insertAnswer).execute();
    await db
      .insertInto("bank_soal_topic")
      .values({
        bank_soal_id: soal.id,
        topic_id: topic[randomKeyTopic].id,
      })
      .execute();
  }
}
