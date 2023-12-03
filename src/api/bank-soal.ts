import express from "express";
import { db } from "../database";
import { BankSoalCRUD } from "../schema/api";
import { sql } from "kysely";
import { AppResult } from "../schema/error";
import { Entities } from "../schema/database";
import { verifyToken } from "../middlewares";

const router = express.Router();

router.use(verifyToken);

router.get<{}, AppResult<BankSoalCRUD["read_many"]["response"]>, {}>(
  "/",
  async (req, res) => {
    try {
      const soal = await db
        .selectFrom("bank_soal")
        .leftJoin(
          "bank_soal_topic",
          "bank_soal_topic.bank_soal_id",
          "bank_soal.id"
        )
        .leftJoin("topic", "topic.id", "bank_soal_topic.topic_id")
        .selectAll("bank_soal")
        .select(sql<Array<string>>`JSON_ARRAYAGG(topic.name)`.as("topics"))
        .orderBy("bank_soal.created_at", "desc")
        .groupBy("bank_soal.id")
        .execute();

      return res.json({ data: soal });
    } catch (err) {
      return res.status(500).json({ message: "Fail: Internal Server Error" });
    }
  }
);

router.get<{}, AppResult<BankSoalCRUD["topic"]["response"]>>(
  "/topic",
  async (req, res) => {
    try {
      const topic = await db.selectFrom("topic").selectAll().execute();

      return res.json({ data: topic });
    } catch (err) {
      return res.status(500).json({ message: "Fail: Internal Server Error" });
    }
  }
);

router.post<
  {},
  AppResult<BankSoalCRUD["create"]["response"]>,
  BankSoalCRUD["create"]["body"]
>("/", async (req, res) => {
  try {
    await db.transaction().execute(async (trx) => {
      const bankSoal = await trx
        .insertInto("bank_soal")
        .values({
          question: req.body.question,
          difficulty: req.body.difficulty,
        })
        .executeTakeFirstOrThrow();

      if (bankSoal.insertId && req.body.topics && req.body.topics.length > 0) {
        const inserTopic: Entities["bank_soal_topic"]["insert"][] =
          req.body.topics.map((topic) => {
            return {
              topic_id: topic,
              bank_soal_id: Number(bankSoal.insertId),
            };
          });
        await trx.insertInto("bank_soal_topic").values(inserTopic).execute();
      }
      if (bankSoal.insertId) {
        const insertAnswer: Entities["bank_soal_answer"]["insert"][] =
          req.body.answers.map((answer) => {
            return {
              bank_soal_id: Number(bankSoal.insertId),
              answer: answer.answer,
              is_correct: answer.is_correct,
            };
          });
        await trx.insertInto("bank_soal_answer").values(insertAnswer).execute();
      }
    });
    return res.status(201).json({ message: "Success" });
  } catch (err) {
    return res.status(500).json({ message: "Fail: Internal Server Error" });
  }
});

export default router;
