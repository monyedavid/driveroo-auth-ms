import * as faker from "faker";
import { User } from "../../../entity/User";
import { TestClient } from "../../../class/test";

faker.seed(Date.now() + 3);
const email = faker.internet.email();
const password = faker.internet.password();

let userId: string;
let client: TestClient;

beforeAll(async () => {
	// new client instance
	client = new TestClient(process.env.TEST_HOST as string);
	// create client
	userId = await client.beforeAllCreateAnddInsertTestClient(email, password);
	//  Update confirmation
	await User.update({ email }, { confirmed: true });
});

afterAll(async () => {
	TestClient.close();
});

describe("ME", () => {
	it("return null if no cookie", async () => {
		const MeQueryResponse = await client.me();
		expect(MeQueryResponse.data.me).toBeNull();
	});

	it("get current user", async () => {
		// LOGIN
		await client.login(email, password);
		// ME TEST
		const MeQueryResponse = await client.me();

		expect(MeQueryResponse.data).toEqual({
			me: {
				id: userId,
				email
			}
		});
	});
});
