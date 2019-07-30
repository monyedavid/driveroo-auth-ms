import * as Redis from "ioredis";

// Redis Server
export const redis = new Redis(process.env.REDIS_URL);
