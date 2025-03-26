// src/utils/redisClient.ts
import Redis from "ioredis";

const redis = new Redis(); // default = localhost:6379

export default redis;

//redis.set("testKey", "Hello Redis!");
//redis.get("testKey", (err, result) => console.log("🧠 Redis says:", result));