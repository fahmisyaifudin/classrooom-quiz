import express from "express";
import student from "./student";
import banksoal from "./bank-soal";

const router = express.Router();

router.use("/student", student);
router.use("/bank-soal", banksoal);

export default router;
