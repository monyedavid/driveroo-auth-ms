import { ResolverMap } from "../../../types/graphql-utile";
import { DriverProfile } from "../../../class/auth/driver.class";

export const resolvers: ResolverMap = {
    Query: {
        bye: () => "THSES NUTS SON!"
    },

    Mutation: {
        firstUpdate: async (
            _,
            args: GQL.IFirstUpdateOnMutationArguments,
            __
        ) => {
            if (!args.id) {
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

            return await new DriverProfile().firstUpdate(
                {
                    dob: args.dob,
                    mothers_maiden_name: args.mothers_maiden_name,
                    primary_location: args.primary_location,
                    secondary_location: args.secondary_location,
                    tertiary_location: args.tertiary_location,
                    bank_bvn: args.bank_bvn,
                    bank_: args.bank_,
                    avatar: args.avatar,
                    driversLicense: args.driversLicense,
                    driverLicenseNumber: args.driverLicenseNumber
                },
                { id: args.id, token: args.token }
            );
        }
    }
};
