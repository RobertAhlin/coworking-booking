// src/utils/redisClient.ts
import Redis from "ioredis";

const redisUrl = process.env.REDISCLOUD_URL;

if (!redisUrl) {
  console.error("[Redis] ❌ REDISCLOUD_URL is not defined. Redis will NOT work.");
} else {
  console.log(`[Redis] Connecting to Redis Cloud at ${new URL(redisUrl).hostname}`);
}

const redis = new Redis(redisUrl ?? "", {
  // Optional: prevent infinite reconnects
  retryStrategy: (times) => {
    if (times >= 5) {
      console.error("[Redis] ❌ Failed to connect after multiple attempts. Giving up.");
      return null; // stops trying
    }
    return Math.min(times * 100, 2000); // retry delay
  },
});

redis.on("error", (err) => {
  console.error("[Redis] Connection error:", err.message);
});

export default redis;
