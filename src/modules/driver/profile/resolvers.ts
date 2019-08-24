import { ResolverMap } from "../../../types/graphql-utile";
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
            console.log(session, "session data");
            console.log(params.driversLicense, "Drivers | Lisence");
            if (!session.userId) {
                return {
                    ok: false,
                    error: [
                        {
                            path: "login",
                            message:
                                "No user profile found, please login in and try again"
                        }
                    ]
                };
            }

            return await new DriverProfile().firstUpdate(params, session);
        }
    }
};
