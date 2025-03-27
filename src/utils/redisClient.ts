// src/utils/redisClient.ts
import Redis from "ioredis";

const redisUrl = process.env.REDISCLOUD_URL || "redis://localhost:6379";

console.log(`[Redis] Connecting to: ${redisUrl.includes("localhost") ? "local Redis" : "Redis Cloud"}`);

const redis = new Redis(redisUrl);

export default redis;