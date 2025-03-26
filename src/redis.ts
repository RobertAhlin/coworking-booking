// src/redis.ts
import Redis from "ioredis";

export const redis = new Redis(); // standard localhost:6379

redis.on("connect", () => {
  console.log("Yes! Connected to Redis");
});

redis.on("error", (err) => {
  console.error("Oh no! Redis connection error:", err);
});