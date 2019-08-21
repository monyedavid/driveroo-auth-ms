import { ResolverMap } from "../../types/graphql-utile";
import { Auth } from "../../class/auth/auth.main.class";

export const resolvers: ResolverMap = {
    Query: {
        previousUser: async (
            _,
            { email, mobile }: GQL.IPreviousUserOnQueryArguments,
            { session, url }
        ) => {
            const service = new Auth(url);
            return await service.previousUser({ email, mobile });
        }
    }
};
