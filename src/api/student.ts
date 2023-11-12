import express from "express";
import { db } from "../database";
import { StudentCRUD } from "../schema/api";
import { AppResult } from "../schema/error";

const router = express.Router();

router.get<{}, StudentCRUD["read_many"]["response"]>("/", async (req, res) => {
  const student = await db.selectFrom("student").selectAll().execute();
  return res.json({ data: student });
});

router.get<
  StudentCRUD["read_single"]["params"],
  AppResult<StudentCRUD["read_single"]["response"]>
>("/:id", async (req, res) => {
  try {
    const student = await db
      .selectFrom("student")
      .where("id", "=", req.params.id)
      .selectAll()
      .executeTakeFirstOrThrow();

    return res.json({ data: student });
  } catch (err) {
    return res.status(500).json({ message: "Fail: Internal Server Error" });
  }
});

router.post<
  {},
  AppResult<StudentCRUD["create"]["response"]>,
  StudentCRUD["create"]["body"]
>("/", async (req, res) => {
  await db.insertInto("student").values(req.body).executeTakeFirstOrThrow();
  return res.status(201).json({ message: "Success" });
});

router.put<
  StudentCRUD["update"]["params"],
  AppResult<StudentCRUD["update"]["response"]>,
  StudentCRUD["update"]["body"]
>("/:id", async (req, res) => {
  try {
    await db
      .updateTable("student")
      .set(req.body)
      .where("id", "=", req.params.id)
      .execute();
    return res.status(201).json({ message: "Success" });
  } catch (err) {
    return res.status(500).json({ message: "Fail: Internal Server Error" });
  }
});

router.delete<
  StudentCRUD["delete"]["params"],
  AppResult<StudentCRUD["delete"]["response"]>
>("/:id", async (req, res) => {
  try {
    await db.deleteFrom("student").where("id", "=", req.params.id).execute();
    res.status(201).json({ message: "Success" });
  } catch (err) {
    return res.status(500).json({ message: "Fail: Internal Server Error" });
  }
});

export default router;
