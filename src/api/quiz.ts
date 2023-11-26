import express from "express";
import { db } from "../database";
import { QuizCRUD } from "../schema/api";
import { AppResult } from "../schema/error";
import { verifyToken } from "../middlewares";
import { sql } from "kysely";

const router = express.Router();

router.use(verifyToken);

router.get<{}, AppResult<QuizCRUD["read_many"]["response"]>>(
  "/",
  async (req, res) => {
    try {
      const quiz = await db
        .selectFrom("quiz")
        .leftJoin("user", "user.id", "quiz.created_by")
        .innerJoin(
          (eb) =>
            eb
              .selectFrom("quiz_soal")
              .select([sql<number>`COUNT(*)`.as("qty"), "quiz_id"])
              .groupBy("quiz_soal.quiz_id")
              .as("quiz_soal"),
          (join) => join.onRef("quiz_soal.quiz_id", "=", "quiz.id")
        )
        .selectAll("quiz")
        .select([
          sql<string>`COALESCE(user.fullname, '')`.as("name_created"),
          "quiz_soal.qty",
        ])
        .execute();

      return res.json({ data: quiz });
    } catch (err) {
      return res.status(500).json({ message: "Fail: Internal Server Error" });
    }
  }
);

router.post<
  {},
  AppResult<QuizCRUD["create"]["response"]>,
  QuizCRUD["create"]["body"]
>("/", async (req, res) => {
  try {
    const userId = req.cookies["x-user-uid"] as string;
    const user = await db
      .selectFrom("user")
      .where("auth_key", "=", userId)
      .selectAll()
      .executeTakeFirstOrThrow();

    const arrBankSoal: Array<number> = [];
    for (const detail of req.body.detail) {
      const banksoal = await db
        .selectFrom("bank_soal_topic")
        .where("topic_id", "=", detail.topic_id)
        .select("bank_soal_id")
        .limit(detail.qty)
        .execute();

      if (banksoal.length > 0) {
        arrBankSoal.push(...banksoal.map((x) => x.bank_soal_id));
      }
    }

    await db.transaction().execute(async (trx) => {
      const { detail, ...header } = req.body;

      const quiz = await trx
        .insertInto("quiz")
        .values({
          created_by: user.id,
          ...header,
        })
        .executeTakeFirstOrThrow();

      await trx
        .insertInto("quiz_soal")
        .values(
          arrBankSoal.map((soal) => {
            return {
              quiz_id: Number(quiz.insertId),
              bank_soal_id: soal,
            };
          })
        )
        .execute();
    });
    return res.status(201).json({ message: "Success" });
  } catch (err) {
    return res.status(500).json({ message: "Fail: Internal Server Error" });
  }
});

type AnswerItem = Array<{
  answer: string;
  id: number;
}>;

router.get<
  QuizCRUD["read_single"]["params"],
  AppResult<QuizCRUD["read_single"]["response"]>
>("/:id", async (req, res) => {
  try {
    const header = await db
      .selectFrom("quiz")
      .innerJoin("quiz_soal", "quiz_soal.quiz_id", "quiz.id")
      .where("quiz.id", "=", req.params.id)
      .select([
        "quiz.description",
        "quiz.start",
        "quiz.end",
        "quiz_soal.bank_soal_id",
      ])
      .execute();

    const resultHeader = {
      description: header[0].description,
      start: header[0].start,
      end: header[0].end,
    };

    const arrBankSoal = header.map((x) => x.bank_soal_id);

    const questions = await db
      .selectFrom("bank_soal")
      .innerJoin(
        "bank_soal_answer",
        "bank_soal_answer.bank_soal_id",
        "bank_soal.id"
      )
      .where("bank_soal.id", "in", arrBankSoal)
      .select([
        "bank_soal.id",
        "question",
        sql<AnswerItem>`JSON_ARRAYAGG(JSON_OBJECT('answer', answer, 'id', bank_soal_answer.id))`.as(
          "answers"
        ),
      ])
      .groupBy("bank_soal.id")
      .execute();

    return res.json({ data: { ...resultHeader, questions } });
  } catch (err) {
    return res.status(500).json({ message: "Fail: Internal Server Error" });
  }
});

router.post<
  QuizCRUD["answer"]["params"],
  AppResult<QuizCRUD["answer"]["response"]>,
  QuizCRUD["answer"]["body"]
>("/answer/:id", async (req, res) => {
  try {
    const header = await db
      .selectFrom("quiz")
      .innerJoin("quiz_soal", "quiz_soal.quiz_id", "quiz.id")
      .where("quiz.id", "=", req.params.id)
      .select(["quiz_soal.bank_soal_id"])
      .execute();

    const arrBankSoal = header.map((x) => x.bank_soal_id);

    const answers = await db
      .selectFrom("bank_soal_answer")
      .where("bank_soal_answer.bank_soal_id", "in", arrBankSoal)
      .select([
        "bank_soal_answer.bank_soal_id as question_id",
        "bank_soal_answer.id as answer_id",
        "bank_soal_answer.is_correct",
      ])
      .execute();

    const n_soal = arrBankSoal.length;
    let n_correct = 0;

    for (const answer of req.body) {
      const [checkAnswer] = answers.filter(
        (x) =>
          x.answer_id == answer.answer_id && x.question_id == answer.question_id
      );
      if (checkAnswer && checkAnswer.is_correct) {
        n_correct++;
      }
    }

    const score = (n_correct / n_soal) * 100;

    return res.status(200).json({ data: { score } });
  } catch (err) {
    return res.status(500).json({ message: "Fail: Internal Server Error" });
  }
});

export default router;
