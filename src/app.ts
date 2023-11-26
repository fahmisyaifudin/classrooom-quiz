import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import * as middlewares from "./middlewares";
import api from "./api";
import MessageResponse from "./schema/response";
import { initFirebase } from "./libs/firebase";

require("dotenv").config();

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

initFirebase();

app.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    message: "Classroom Quiz",
  });
});

app.use("/api", api);
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
