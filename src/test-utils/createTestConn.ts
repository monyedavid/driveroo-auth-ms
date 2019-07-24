import { createConnection, getConnectionOptions } from "typeorm";

export const createTestConn = async (resetDB: boolean = false) => {
	const connectionOpts = await getConnectionOptions(process.env.NODE_ENV);
	return createConnection({
		...connectionOpts,
		name: "default",
		synchronize: resetDB,
		dropSchema: resetDB
	});
};
