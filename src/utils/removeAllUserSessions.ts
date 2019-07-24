import { redis } from "../cache";
import { userseesionidPrefix, redisessionprefix } from "../constant";

export const removeAllUserSessions = async (userId: string) => {
	const sessionIds = await redis.lrange(
		`${userseesionidPrefix}${userId}`,
		0,
		-1
	);

	const promises: any[] = [];
	for (let i = 0; i < sessionIds.length; i++) {
		promises.push(redis.del(`${redisessionprefix}${sessionIds[i]}`));
	}
	await Promise.all(promises);
};
