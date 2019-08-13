// import { IResolvers } from "graphql-tools";
import { ResolverMap } from "../../../types/graphql-utile";
import { removeAllUserSessions } from "../../../utils/removeAllUserSessions";
import { driverrBotSession } from "../../../constant";

export const resolvers: ResolverMap = {
    Query: {
        dummy: () => "Hey dumbass!"
    },
    Mutation: {
        logout: async (_, __, { session, redis, res }) => {
            const { userId } = session;
            if (userId) {
                await removeAllUserSessions(userId);
                session.destroy(err => {
                    if (err) {
                        console.log(err);
                    }
                });
                res.clearCookie(driverrBotSession);
                return true;
            }

            return false;
        }
    }
};
