import { v4 } from "uuid";
import { Redis } from "ioredis";

export const AdminRegistratonLink = async (
    url: string,
    data: AUTH.IUserAdminLinkData,
    redis: Redis
) => {
    const id = v4();
    await redis.set(id, JSON.stringify(data), "ex", 60 * 60 * 24);
    return `${url}/api/v1/user/new-admin-registration/${id}`;
};
