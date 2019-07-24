import * as Redis from "ioredis";

// Redis Server
export const redis =
	process.env.NODE_ENV === "production"
		? new Redis(process.env.REDIS_URL)
		: new Redis();
