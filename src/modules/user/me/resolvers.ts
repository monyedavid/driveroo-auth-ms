import { ResolverMap } from "../../../types/graphql-utile";
import { createMiddleWare } from "../../../utils/createMiddleWare";
import middleware from "./middleware";
import { Auth } from "../../../class/auth/auth.main.class";

export const resolvers: ResolverMap = {
    Query: {
        me: createMiddleWare(middleware, async (_, __, { session }) => {
            const service = new Auth();
            const result = await service.me(session);
            if (!result.ok) {
                return result.error;
            }

            if (result.ok)
                return {
                    user: result.user,
                    token: result.token
                };

            return {
                path: "me",
                message: "No user Porfile Found"
            };
        })
    }
};
