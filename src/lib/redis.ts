import Redis from "ioredis";

const globalForRedis = globalThis as unknown as {
  redis?: Redis;
};

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("REDIS_URL is not set in the environment.");
}

export const redis = globalForRedis.redis ?? new Redis(redisUrl);

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}
