import * as faker from "faker";
import { User } from "../../../../entity/User";
import { invalidLogin, confirmEmailError } from "../../../../constant";
import { TestClient } from "../../../../class/test";

faker.seed(Date.now() + 1);
const email = faker.internet.email();
const password = faker.internet.password();

let client: TestClient;
beforeAll(async () => {
	await TestClient.conn();
	client = new TestClient(process.env.TEST_HOST as string);
});

afterAll(async () => {
	await TestClient.close();
});

const loginManExpectError = async (e: string, p: string, errMssg: string) => {
	const response = await client.login(e, p);
	expect(response.data).toEqual({
		login: [
			{
				path: "email",
				message: errMssg
			}
		]
	});
};

describe("Login", () => {
	it("Email not found ERROR!!", async () => {
		// login before creating user
		await loginManExpectError("what.what@gmail.com", "whatever", invalidLogin);
	});

	it("Email not confirmed ERROR!!", async () => {
		//  register email address
		await client.register(email, password);

		// confirm email error
		await loginManExpectError(email, password, confirmEmailError);

		// update confirmed on user
		await User.update({ email }, { confirmed: true });

		// bad passowrd test
		await loginManExpectError(email, "password", invalidLogin);

		const response = await client.login(email, password);
		expect(response.data).toEqual({ login: null });
	});
});
