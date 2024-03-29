import { generateNamespace } from "@gql2ts/from-schema";
import * as fs from "fs";
import * as path from "path";
import { genschema } from "../utils/generateSchema";

const typescriptTypes = generateNamespace("GQL", genschema());

fs.writeFile(
	path.join(__dirname, "../types/schema.d.ts"),
	typescriptTypes,
	err => console.log(err)
);
