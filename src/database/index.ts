import { Database } from "../schema/database";
import { createPool } from "mysql2";
import { Kysely, MysqlDialect } from "kysely";

const dialect = new MysqlDialect({
  pool: createPool({
    database: "classroom-quiz",
    host: "localhost",
    user: "mysql",
    password: "mysql",
    port: 3306,
  }),
});

export const db = new Kysely<Database>({
  dialect,
});
