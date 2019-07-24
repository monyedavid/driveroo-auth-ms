import { createConnection, getConnectionOptions } from "typeorm";

export const creatTypeormConnection = async () => {
	const connectionOpts = await getConnectionOptions(process.env.NODE_ENV);
	return createConnection({ ...connectionOpts, name: "default" });
};
