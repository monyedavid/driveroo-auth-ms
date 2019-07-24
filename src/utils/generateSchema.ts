import * as fs from "fs";
import * as path from "path";
import * as glob from "glob";
import { makeExecutableSchema } from "graphql-tools";
import { mergeTypes, mergeResolvers } from "merge-graphql-schemas";

export const genschema = () => {
	const pathToModules = path.join(__dirname, "../modules");
	const graphqlTypes = glob // returns an array of all the graphql types in the project
		.sync(`${pathToModules}/**/*.graphql`)
		.map(x => fs.readFileSync(x, { encoding: "utf8" }));

	const resolvers = glob // returns an array of all the resolvers in the project
		.sync(`${pathToModules}/**/resolvers.?s`)
		.map(resolver => require(resolver).resolvers);

	return makeExecutableSchema({
		typeDefs: mergeTypes(graphqlTypes),
		resolvers: mergeResolvers(resolvers)
	});
};

// import { importSchema } from "graphql-import"; || Validates schema
// import { mergeSchemas, makeExecutableSchema } from "graphql-tools";
// // tslint:disable-next-line: no-implicit-dependencies
// import { GraphQLSchema } from "graphql";

// import * as fs from "fs";
// import * as path from "path";
// import * as glob from "glob";

// export const genschema = () => {
// 	// @DESC AUTOMATED INJECTION OF GRAPHQL RESOLVERS || [TYPEDEFS]SCHEMAS.GRAPHQL
// 	const schemas: GraphQLSchema[] = [];
// 	const folders = fs.readdirSync(path.join(__dirname, "../modules"));
// 	// Generate resolvers and typedefs || makeExecutableSchema ARRAY ||
// 	folders.forEach(folder => {
// 		const { resolvers } = require(`../modules/${folder}/resolvers`);
// 		const typeDefs = importSchema(
// 			path.join(__dirname, `../modules/${folder}/schema.graphql`)
// 		);
// 		schemas.push(makeExecutableSchema({ resolvers, typeDefs }));
// 	});

// 	return mergeSchemas({ schemas });
// };
