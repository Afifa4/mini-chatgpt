import "dotenv/config";

import express from "express";
import authRouter from "./routes/auth.routes.js";
import chatRouter from "./routes/chats.routes.js";
import { notFound, errorHandler } from "./middlewares/error.middleware.js";

import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

app.use("/api/auth", authRouter);
app.use("/api/chats", chatRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
