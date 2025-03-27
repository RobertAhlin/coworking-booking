// src/redis.ts
import Redis from "ioredis";

const redisUrl = process.env.REDISCLOUD_URL;

if (!redisUrl) {
  console.error("[Redis] Error: REDISCLOUD_URL is not defined. Redis will NOT work.");
} else {
  console.log(`[Redis] Connecting to Redis Cloud at ${new URL(redisUrl).hostname}`);
}

let errorLogCount = 0;
const MAX_ERROR_LOGS = 2;

const redis = new Redis(redisUrl ?? "", {
  retryStrategy: (times) => {
    if (times >= 5) {
      console.error("[Redis] Failed to connect after multiple attempts. Giving up.");
      return null;
    }
    return Math.min(times * 100, 5000); // Retry delay
  },
});

redis.on("error", (err) => {
  if (errorLogCount < MAX_ERROR_LOGS) {
    console.error("[Redis] Connection error:", err.message);
    errorLogCount++;
    if (errorLogCount === MAX_ERROR_LOGS) {
      console.warn("[Redis] Further errors will be suppressed.");
    }
  }
});

export default redis;