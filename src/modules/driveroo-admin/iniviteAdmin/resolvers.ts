import { ResolverMap } from "../../../types/graphql-utile";
import { UAdmin } from "../../../class/auth/admin.invitation";

export const resolvers: ResolverMap = {
    Query: {
        bye: () => "THSES NUTS SON!"
    },
    Mutation: {
        admin_: async (_, { email, mobile }: GQL.IAdminLinkParams, { url }) => {
            return await new UAdmin(url).registerNewUser({ email, mobile });
        }
    }
};
