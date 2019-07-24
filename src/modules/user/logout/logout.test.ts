import * as faker from "faker";
import { TestClient } from "../../../class/test";

faker.seed(Date.now() + 2);
const email = faker.internet.email();
const password = faker.internet.password();

let client: TestClient;

beforeAll(async () => {
	// new client instance
	client = new TestClient(process.env.TEST_HOST as string);
	// create client
	await client.beforeAllCreateAnddInsertTestClient(email, password);
});

afterAll(async () => {
	// close client
	await TestClient.close();
});
describe("LOGOUT", () => {
	it("Handle multiple sessions", async () => {
		const session1: TestClient = new TestClient(process.env
			.TEST_HOST as string);
		const session2: TestClient = new TestClient(process.env
			.TEST_HOST as string);

		// Login witih different sessiosn
		session1.login(email, password);
		session2.login(email, password);

		expect(await session1.me()).toEqual(await session2.me());

		// Logout from session 1
		await session1.logout();

		// Expect Both sessions to expire
		expect(await session1.me()).toEqual(await session2.me());
	});

	it("test logging out a user", async () => {
		// login in to server to generate cookie
		await client.login(email, password);

		// Logout mutation.. Delete Session Data
		await client.logout();

		// Me Query with Session DATA[non-existence]
		const MeQueryResponse = await client.me();

		expect(MeQueryResponse.data.me).toBeNull();
	});
});
