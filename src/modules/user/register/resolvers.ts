import { ResolverMap } from "../../../types/graphql-utile";
import { DriverAuth } from "../../../class/auth/driver.class";

export const resolvers: ResolverMap = {
    Query: {
        bye: () => "THSES NUTS SON!"
    },

    Mutation: {
        register: async (
            _,
            args: GQL.IRegisterOnMutationArguments,
            { url }
        ) => {
            const service = new DriverAuth(url);
            await service.register(args.params);
        }
    }
};
