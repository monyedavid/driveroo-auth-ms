import { Resolver } from "../../../types/graphql-utile";
import { AdminModel } from "../../../models/Admin";

export default async (
    resolver: Resolver,
    parent: any,
    args: any,
    context: any,
    info: any
) => {
    if (context.userId) {
        // find user
        if (
            !(await AdminModel.findOne({
                _id: context.userId
            }))
        )
            return await resolver(
                parent,
                args,
                { ...context, AdminloggedIn: false },
                info
            );
    }
    // middleware
    if (context.session) {
        if (context.session.model === "admin")
            return await resolver(
                parent,
                args,
                { ...context, AdminloggedIn: true },
                info
            );
    }
    // afterware

    return await resolver(
        parent,
        args,
        { ...context, AdminloggedIn: false },
        info
    );
};
