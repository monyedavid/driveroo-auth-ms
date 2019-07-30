import { ResolverMap } from "../../../types/graphql-utile";
import { Auth } from "../../../class/auth/auth.main.class";

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
            const service = new Auth(url);
            if (args.model === "driver")
                return await service.register(args.params, "driver");

            if (args.model === "admin")
                return await service.register(args.params, "admin");

            if (args.model === "user")
                return await service.register(args.params, "user");

            return [
                {
                    path: "Register",
                    message: "Unknown Model | For the developer"
                }
            ];
        }
    }
};
