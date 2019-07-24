// import { IResolvers } from "graphql-tools";
import { ResolverMap } from "../../../types/graphql-utile";
import { removeAllUserSessions } from "../../../utils/removeAllUserSessions";

export const resolvers: ResolverMap = {
	Query: {
		dummy: () => "Hey dumbass!"
	},
	Mutation: {
		logout: async (_, __, { session, redis }) => {
			const { userId } = session;
			if (userId) {
				await removeAllUserSessions(userId);
				session.destroy(err => {
					if (err) {
						console.log(err);
					}
				});
				return true;
			}
			return false;
			// LOGOUT AND INDIVIDUAL SESSION
			// new Promise(res =>
			// 	session.destroy(err => {
			// 		if (err) {
			// 			console.log("Logout error:", err);
			// 		}
			// 		res(true);
			// 	})
			// )
		}
	}
};
