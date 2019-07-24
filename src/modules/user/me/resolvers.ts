// import { IResolvers } from "graphql-tools";
import { User } from "../../../entity/User";
import { ResolverMap } from "../../../types/graphql-utile";
import { createMiddleWare } from "../../../utils/createMiddleWare";
import middleware from "./middleware";

export const resolvers: ResolverMap = {
	Query: {
		me: createMiddleWare(middleware, async (_, __, { session }) => {
			const me: User = await User.findOne({
				where: { id: session.userId }
			});
			return me;
		})
	}
};
