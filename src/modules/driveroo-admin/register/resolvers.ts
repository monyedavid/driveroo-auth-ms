import { ResolverMap } from "../../../types/graphql-utile";
import { Auth } from "../../../class/auth/auth.main.class";
import { decodeRegToken } from "../../../utils/generateTohen";
import { redis } from "../../../cache";

export const resolvers: ResolverMap = {
    Mutation: {
        admin_link_register: async (
            _,
            {
                params: { encrypt_id, password, firstName, lastName }
            }: GQL.IAdminLinkRegisterOnMutationArguments,
            { url }
        ) => {
            const service = new Auth(url);
            const { invalid, decodedvalue } = await decodeRegToken(
                encrypt_id,
                redis
            );

            if (!invalid) {
                const { email, mobile } = decodedvalue;
                if (decodedvalue.exp < Date.now()) {
                    return await service.register(
                        { email, mobile, password, firstName, lastName },
                        "admin"
                    );
                }
            }

            if (invalid)
                return [
                    {
                        path: "Authentication",
                        message:
                            "Cannot Validate Authentication of registration token, please request for another from an admin "
                    }
                ];

            return [
                {
                    path: "Register",
                    message: "Unknown Model | For the developer"
                }
            ];
        }
    }
};
