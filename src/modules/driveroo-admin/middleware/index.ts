import { Resolver } from "../../../types/graphql-utile";
import { AdminModel } from "../../../models/Admin";

export default async (
    resolver: Resolver,
    parent: any,
    args: any,
    context: any,
    info: any
) => {
    if (context.session) {
        if (context.session.userId) {
            // find user
            if (
                !(await AdminModel.findOne({
                    _id: context.session.userId,
                    active: true
                }))
            )
                return await resolver(
                    parent,
                    args,
                    {
                        ...context,
                        AdminloggedIn: false,
                        message:
                            "An invalid user was found, Please Log in as a valid Admin"
                    },
                    info
                );
        }
        // middleware

        if (context.session.model === "admin")
            return await resolver(
                parent,
                args,
                { ...context, AdminloggedIn: true },
                info
            );

        if (
            context.session.model === "user" ||
            context.session.model === "driver"
        )
            return await resolver(
                parent,
                args,
                {
                    ...context,
                    AdminloggedIn: false,
                    message: "Please Log in as a valid Admin to procced"
                },
                info
            );
    }
    // afterware

    return await resolver(
        parent,
        args,
        {
            ...context,
            AdminloggedIn: false,
            message: "No session was found, please re-login to continue"
        },
        info
    );
};
