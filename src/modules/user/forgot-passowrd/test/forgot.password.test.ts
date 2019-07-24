import * as faker from "faker";
import { TestClient } from "../../../../class/test";
import { createForgotPasswordLink } from "../../../../utils/createForgotPasswordLink";
import { redis } from "../../../../cache";
import { forgotPasswordLockAccount } from "../../../../utils/forgotPasswordLockAccount";
import {
	forgotPasswordLockError,
	passwordNotLongEnough,
	expiredKeyError
} from "../../../../constant";
import { User } from "../../../../entity/User";
// fhak

faker.seed(Date.now() + 0)
const email = faker.internet.email();
const password = faker.internet.password();
const newPassword = faker.internet.password();

let client: TestClient;
let id: string;

beforeAll(async () => {
	// new client instance
	client = new TestClient(process.env.TEST_HOST as string);
	// create client
	id = await client.beforeAllCreateAnddInsertTestClient(email, password);

	await User.update({ email }, { confirmed: true });
});

afterAll(async () => {
	// close client
	await TestClient.close();
});
describe("FORGOUT PASSWORD", () => {
	it("IT WORKS??", async () => {
		// lock account
		await forgotPasswordLockAccount(id);

		// create forogot Password Link
		const url = await createForgotPasswordLink("", id, redis);
		const parts = url.split("/");
		const key = parts[parts.length - 1];

		const response = await client.login(email, password);

		// make sure : User cannot login to locked account
		expect(response).toEqual({
			data: {
				login: [
					{
						path: "email",
						message: forgotPasswordLockError
					}
				]
			}
		}); // PASSESD

		// try changing to password thats to short
		expect(await client.forgotPasswordChange("a", key)).toEqual({
			data: {
				forgotPasswordChange: [
					{
						path: "newPassword",
						message: passwordNotLongEnough
					}
				]
			}
		}); // PASSED

		const resolve = await client.forgotPasswordChange(newPassword, key);
		expect(resolve.data).toEqual({
			forgotPasswordChange: null
		}); // PASSED

		// Attempt to change passowrd more than once with same key
		// try changing to password thats to short
		expect(await client.forgotPasswordChange(password, key)).toEqual({
			data: {
				forgotPasswordChange: [
					{
						path: "key",
						message: expiredKeyError
					}
				]
			}
		}); // PASSED

		// Login USER
		expect(await client.login(email, newPassword)).toEqual({
			data: {
				login: null
			}
		});
	});
});
