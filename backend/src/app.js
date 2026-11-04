import "dotenv/config";

import fs from "node:fs";
import path from "node:path";
import express from "express";
import authRouter from "./routes/auth.routes.js";
import chatRouter from "./routes/chats.routes.js";
import { notFound, errorHandler } from "./middlewares/error.middleware.js";
import { CLIENT_URL, isProduction } from "./config/env.js";

import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";

const app = express();

// Render sits behind a proxy; without this every user shares one IP in rate limits
app.set("trust proxy", 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(isProduction ? "tiny" : "dev"));
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

app.use("/api/auth", authRouter);
app.use("/api/chats", chatRouter);

// In production the backend also serves the built React app from the same URL
const frontendDist = path.resolve(import.meta.dirname, "../../frontend/dist");
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api")) return next();
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

app.use(notFound);
app.use(errorHandler);

export default app;
