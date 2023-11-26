import express from "express";
import { db } from "../database";
import { ProfileCRUD } from "../schema/api";
import { AppResult } from "../schema/error";
import { verifyToken } from "../middlewares";

const router = express.Router();

router.use(verifyToken);

router.get<{}, AppResult<ProfileCRUD["read"]["response"]>>(
  "/",
  async (req, res) => {
    try {
      const userId = req.cookies["x-user-uid"] as string;
      const profile = await db
        .selectFrom("user")
        .where("auth_key", "=", userId)
        .selectAll()
        .executeTakeFirstOrThrow();

      return res.json({ data: profile });
    } catch (err) {
      return res.status(500).json({ message: "Fail: Internal Server Error" });
    }
  }
);

export default router;
