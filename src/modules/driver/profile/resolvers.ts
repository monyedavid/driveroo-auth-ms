import { ResolverMap } from "../../../types/graphql-utile";
import { Auth } from "../../../class/auth/auth.main.class";
import { DriverProfile } from "../../../class/auth/driver.class";

export const resolvers: ResolverMap = {
    Query: {
        bye: () => "THSES NUTS SON!"
    },

    Mutation: {
        firstUpdate: async (
            _,
            { params }: GQL.IFirstUpdateOnMutationArguments,
            { session }
        ) => {
            if (!session.userId) {
                return [
                    {
                        path: "login",
                        message:
                            "No user profile found, please login in and try again"
                    }
                ];
            }

            return await new DriverProfile().firstUpdate(params, session);
        }
    }
};
