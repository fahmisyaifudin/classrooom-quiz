import { Database } from "../schema/database";
import { createPool } from "mysql2";
import { Kysely, MysqlDialect } from "kysely";

require("dotenv").config();

const dialect = new MysqlDialect({
  pool: createPool({
    database: process.env["DATABASE_NAME"],
    host: process.env["DATABASE_HOST"],
    user: process.env["DATABASE_USER"],
    password: process.env["DATABASE_PASSWORD"],
    port: 3306,
  }),
});

export const db = new Kysely<Database>({
  dialect,
});
