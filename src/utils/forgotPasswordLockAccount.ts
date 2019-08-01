import { redis } from "../cache";
import { removeAllUserSessions } from "./removeAllUserSessions";
// USER M9DELS
export const forgotPasswordLockAccount = async (id: string) => {
	// Lockout
	// await User.update({ id }, { forgotPasswordLock: true });
	// // Remove all sessions
	// await removeAllUserSessions(id);
};
