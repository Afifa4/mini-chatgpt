import Redis from "ioredis";

// Fail fast when Redis is slow or down, instead of making requests hang
const redis = new Redis(process.env.REDIS_URL, {
  commandTimeout: 2000,
  connectTimeout: 5000,
  maxRetriesPerRequest: 1,
  enableOfflineQueue: false,
});

redis.on("connect", () => {
  console.log("Redis connected successfully");
});
redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

// Serverless hosts (Vercel) start the app on the first request, so that request waits here
export function waitForRedis(timeoutMs = 5000) {
  if (redis.status === "ready") return Promise.resolve();

  return new Promise((resolve) => {
    const timer = setTimeout(resolve, timeoutMs);
    redis.once("ready", () => {
      clearTimeout(timer);
      resolve();
    });
  });
}

export default redis;
