import { ResolverMap } from "../../../types/graphql-utile";
import { Auth } from "../../../class/auth/auth.main.class";

export const resolvers: ResolverMap = {
    Mutation: {
        admin_link_register: async (_, args, { url }) => {
            const service = new Auth(url);

            return [
                {
                    path: "Register",
                    message: "Unknown Model | For the developer"
                }
            ];
        }
    }
};
