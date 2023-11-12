import { Kysely } from "kysely";
import { Entities, Database } from "../../schema/database";
import { faker } from "@faker-js/faker";

export async function seedStudent(db: Kysely<Database>): Promise<void> {
  console.log("Inserting sample student data to table...");

  const insertStudent: Entities["student"]["insert"][] = Array(10)
    .fill(null)
    .map(() => {
      return {
        name: faker.person.fullName(),
        address: faker.location.streetAddress(),
      };
    });

  await db.insertInto("student").values(insertStudent).execute();
}
