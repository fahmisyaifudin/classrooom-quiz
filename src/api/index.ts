import express from "express";
import student from "./student";
import banksoal from "./bank-soal";
import profile from "./profile";
import quiz from "./quiz";

const router = express.Router();
router.use("/student", student);
router.use("/bank-soal", banksoal);
router.use("/profile", profile);
router.use("/quiz", quiz);

export default router;
