import { ResolverMap } from "../../../types/graphql-utile";

export const resolvers: ResolverMap = {
    Query: {
        bye: () => "THSES NUTS SON!"
    },
    Mutation: {
        admin_: async (_, __, { url }) => {}
    }
};
