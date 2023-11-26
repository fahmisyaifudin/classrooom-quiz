import { Kysely } from "kysely";
import { Database, Entities } from "../../schema/database";

export async function seedUser(
  db: Kysely<Database>
): Promise<Entities["user"]["select"]> {
  console.log("Inserting sample student data to table...");

  const user = await db
    .insertInto("user")
    .values({
      auth_key: "ESkvU1a3CeRhv7zvhoo5DahnUvR2",
      fullname: "Fahmi Syaifudin",
      role: "lecturer",
    })
    .executeTakeFirstOrThrow();

  const userId = Number(user.insertId);
  return db
    .selectFrom("user")
    .where("id", "=", userId)
    .selectAll()
    .executeTakeFirstOrThrow();
}
