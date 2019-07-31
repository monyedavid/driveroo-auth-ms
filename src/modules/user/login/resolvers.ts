import { ResolverMap } from "../../../types/graphql-utile";
import { Auth } from "../../../class/auth/auth.main.class";

export const resolvers: ResolverMap = {
    Query: {
        bye2: () => "THSES NUTS SON!"
    },

    Mutation: {
        login: async (
            _,
            { email, password, model }: GQL.ILoginOnMutationArguments,
            { session, req, url }
        ) => {
            const service = new Auth(url);
            const result = await service.login(
                { email, password },
                model,
                session,
                req.sessionID
            );

            if (result.ok) {
                return null;
            }
            if (!result.ok) {
                return result.error;
            }
        }
    }
};
