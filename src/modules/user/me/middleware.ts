import { Resolver } from "../../../types/graphql-utile";

export default async (
	resolver: Resolver,
	parent: any,
	args: any,
	context: any,
	info: any
) => {
	// middleware
	const result = await resolver(
		parent,
		args,
		context,
		// { ...context, loggedIn: true },
		info
	);
	// afterware

	return result;
};
