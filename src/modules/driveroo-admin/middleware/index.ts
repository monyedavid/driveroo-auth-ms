import { Resolver } from "../../../types/graphql-utile";

export default async (
    resolver: Resolver,
    parent: any,
    args: any,
    context: any,
    info: any
) => {
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

    return await resolver(parent, args, context, info);
};
