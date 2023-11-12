import express from "express";
import student from "./student";

const router = express.Router();

router.use("/student", student);

export default router;
