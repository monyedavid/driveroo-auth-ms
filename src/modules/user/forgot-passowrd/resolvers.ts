import * as yup from "yup";
import { ResolverMap } from "../../../types/graphql-utile";
// import * as bcrypt from "bcryptjs";

// import { createForgotPasswordLink } from "../../../utils/createForgotPasswordLink";
// import { forgotPasswordLockAccount } from "../../../utils/forgotPasswordLockAccount";
// import { User } from "../../../entity/User";
// import {
//     userNotFoundError,
//     forgotPasswordPrefix,
//     expiredKeyError
// } from "../../../constant";
// import { formatYupError } from "../../../utils/formatYupError";
import { registerPasswordValidation } from "../../../schema/register.action.yup";

const schema = yup.object().shape({
    newPassword: registerPasswordValidation
});

export const resolvers: ResolverMap = {
    Query: {
        bye3: () => "THSES NUTS SON!"
    },

    Mutation: {
        sendForgotPasswordEmail: async (
            _,
            { email }: GQL.ISendForgotPasswordEmailOnMutationArguments,
            { redis }
        ) => {
            //     // Find user ID
            //     const { id } = await User.findOne({ where: { email } });
            //     if (!id) {
            //         return [
            //             {
            //                 path: "email",
            //                 message: userNotFoundError
            //             }
            //         ];
            //     }
            //     // lock account
            //     await forgotPasswordLockAccount(id);
            //     // @todd fornt end url
            //     // create forogot Password Link
            //     await createForgotPasswordLink("", id, redis);

            //     return true;
            // },

            // forgotPasswordChange: async (
            //     _,
            //     { newPassword, key }: GQL.IForgotPasswordChangeOnMutationArguments,
            //     { redis }
            // ) => {
            //     const userid = await redis.get(`${forgotPasswordPrefix}${key}`);
            //     if (!userid) {
            //         return [
            //             {
            //                 path: "key",
            //                 message: expiredKeyError
            //             }
            //         ];
            //     }

            //     try {
            //         await schema.validate({ newPassword }, { abortEarly: false });
            //     } catch (error) {
            //         return formatYupError(error);
            //     }

            //     const hashedPassword = await bcrypt.hash(newPassword, 10);

            //     const updatePromsie = User.update(
            //         { id: userid },
            //         {
            //             forgotPasswordLock: false,
            //             password: hashedPassword
            //         }
            //     );

            //     // DELETE KEY
            //     const deleteKeyPromise = redis.del(`${forgotPasswordPrefix}${key}`);

            //     await Promise.all([updatePromsie, deleteKeyPromise]);

            return null;
        }
    }
};
