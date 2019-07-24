import { redis } from "../cache";
import { removeAllUserSessions } from "./removeAllUserSessions";
import { User } from "../entity/User";

export const forgotPasswordLockAccount = async (id: string) => {
	// Lockout
	await User.update({ id }, { forgotPasswordLock: true });
	// Remove all sessions
	await removeAllUserSessions(id);
};
