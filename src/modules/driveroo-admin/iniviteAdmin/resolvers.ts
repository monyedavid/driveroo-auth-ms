import { ResolverMap } from "../../../types/graphql-utile";
import { UAdmin } from "../../../class/auth/admin.invitation";
import middleware from "../middleware";
import { createMiddleWare } from "../../../utils/createMiddleWare";

export const resolvers: ResolverMap = {
    Query: {
        bye: () => "THSES NUTS SON!"
    },
    Mutation: {
        admin_: createMiddleWare(
            middleware,
            async (_, { email, mobile }: GQL.IAdminLinkParams, { url }) => {
                return await new UAdmin(url).registerNewUser({ email, mobile });
            }
        )
    }
};
//
