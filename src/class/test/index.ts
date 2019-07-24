import * as rp from "request-promise";
import { Connection } from "typeorm";
import { User } from "../../entity/User";
import { createTestConn } from "../../test-utils/createTestConn";

let connection: Connection;
export class TestClient {
	static async conn() {
		connection = await createTestConn();
	}

	static async close() {
		await connection.close();
	}

	url: string;
	options: {
		jar: any;
		withCredentials: boolean;
		json: boolean;
	};

	constructor(url: string) {
		this.url = url;
		this.options = {
			withCredentials: true,
			json: true,
			jar: rp.jar()
		};
	}

	async beforeAllCreateAnddInsertTestClient(email: string, password: string) {
		await TestClient.conn();
		const user = await User.create({
			email,
			password,
			confirmed: true
		}).save();
		return user.id;
	}

	async logout() {
		return rp.post(this.url, {
			...this.options,
			body: {
				query: `
        mutation {
          logout
        }
        `
			}
		});
	}

	async forgotPasswordChange(newPassword: string, key: string) {
		return rp.post(this.url, {
			...this.options,
			body: {
				query: `
          mutation {
						forgotPasswordChange(newPassword: "${newPassword}", key: "${key}") {
							path
							message
						}
					}`
			}
		});
	}

	async me() {
		return rp.post(this.url, {
			...this.options,
			body: {
				query: `
        {
          me {
            id
            email
          }
        }`
			}
		});
	}

	async login(email: string, password: string) {
		return rp.post(this.url, {
			...this.options,
			body: {
				query: `
        mutation {
          login(email: "${email}", password: "${password}") {
            path
            message
          }
        }`
			}
		});
	}

	async register(email: string, password: string) {
		return rp.post(this.url, {
			...this.options,
			body: {
				query: `
        mutation {
          register(email: "${email}", password: "${password}") {
            path
            message
          }
        }`
			}
		});
	}
}
