import { ResolverMap } from "../../../types/graphql-utile";
import { Auth } from "../../../class/auth/auth.main.class";
import { validateEmailRegex } from "../../../utils/email.mobile.validation";

export const resolvers: ResolverMap = {
    Query: {
        bye2: () => "THSES NUTS SON!"
    },

    Mutation: {
        login: async (
            _,
            { emailormobile, password, model }: GQL.ILoginOnMutationArguments,
            { session, req, url }
        ) => {
            let result;
            const service = new Auth(url);

            if (validateEmailRegex(emailormobile))
                result = await service.login(
                    { email: emailormobile, password },
                    session,
                    req.sessionID as any,
                    model as any
                );

            if (!validateEmailRegex(emailormobile))
                result = await service.login(
                    { mobile: emailormobile, password },
                    session,
                    req.sessionID as any,
                    model as any
                );

            console.log(result, "| result data");

            if (result.ok) {
                return [
                    {
                        sessionId: result.sessionId,
                        model: result.model
                    }
                ];
            }
            if (!result.ok) {
                return result.error;
            }

            return [
                {
                    path: "login",
                    message: "Unable to Login"
                }
            ];
        }
    }
};
