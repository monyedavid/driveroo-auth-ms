import { ResolverMap } from "../../../types/graphql-utile";

export const resolvers: ResolverMap = {
    Query: {
        bye2: () => "THSES NUTS SON!"
    },

    Mutation: {
        login: async (
            _,
            { email, password }: GQL.ILoginOnMutationArguments,
            { redis, session, req }
        ) => {}
    }
};
