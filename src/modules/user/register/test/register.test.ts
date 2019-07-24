import * as faker from "faker";
import { request } from "graphql-request";
import { User } from "../../../../entity/User";
import {
	duplicateEmail,
	emailNotLongEnough,
	invalidEmail,
	passwordNotLongEnough
} from "../../../../constant";
import { Connection } from "typeorm";
import { createTestConn } from "../../../../test-utils/createTestConn";

faker.seed(Date.now() + 5);
const email = faker.internet.email();
const password = faker.internet.password();

const mutation = (e: string, p: string) => `
mutation {
  register(email: "${e}", password: "${p}") {
		path
		message
	}
}
`;

let conn: Connection;
beforeAll(async () => {
	conn = await createTestConn();
});

afterAll(async () => {
	conn.close();
});

describe("User registration processess", () => {
	it("Reg user & check for duplicate emails", async () => {
		// REGISTER USER
		const response = await request(
			process.env.TEST_HOST as string,
			mutation(email, password)
		);
		expect(response).toEqual({ register: null });
		const users = await User.find({ where: { email } });
		expect(users).toHaveLength(1);
		expect(users[0].email).toEqual(email);
		expect(users[0].password).not.toEqual(password);

		// TEST ERROR HANDLER DUPLICATE EMAILS
		const response2: any = await request(
			process.env.TEST_HOST as string,
			mutation(email, password)
		);
		expect(response2.register).toHaveLength(1);
		expect(response2.register[0]).toEqual({
			path: "email",
			message: duplicateEmail
		});
	});

	it("Validates user input || BAD EMAILS", async () => {
		// CARTCH BAD EMAILL
		const response3: any = await request(
			process.env.TEST_HOST as string,
			mutation("b", password)
		);
		expect(response3).toEqual({
			register: [
				{
					path: "email",
					message: emailNotLongEnough
				},
				{
					path: "email",
					message: invalidEmail
				}
			]
		});
	});

	it("Validates user input || BAD PASSWORD", async () => {
		// CATCH BAD PASSWORD
		const response4: any = await request(
			process.env.TEST_HOST as string,
			mutation(email, "a")
		);
		expect(response4).toEqual({
			register: [
				{
					path: "password",
					message: passwordNotLongEnough
				}
			]
		});
	});

	it("Validates user input || BAD EMAILS & PASSOWRD", async () => {
		// CATCH BAD PASSWORD AND EMAIL
		const response5: any = await request(
			process.env.TEST_HOST as string,
			mutation("b", "a")
		);
		expect(response5).toEqual({
			register: [
				{
					path: "email",
					message: emailNotLongEnough
				},
				{
					path: "email",
					message: invalidEmail
				},
				{
					path: "password",
					message: passwordNotLongEnough
				}
			]
		});
	});
});
/**
 *  PACKAGE.JSON SETTING FOR JEST TEST
 *     "transformIgnorePatterns": [
      "<rootDir>/node_modules/"
    ],

    //  "\\.js$": "<rootDir>/node_modules/babel-jest"
 */
