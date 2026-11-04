// Vercel entry point: every /api request runs the same Express app as backend/server.js
import app from "../backend/src/app.js";
import connectDB from "../backend/src/config/database.js";
import { waitForRedis } from "../backend/src/config/cache.js";

// Starts once per instance; later requests reuse the open connections
const ready = Promise.all([connectDB(), waitForRedis()]);

export default async function handler(req, res) {
  await ready;
  return app(req, res);
}
