import fetch from "node-fetch";
import { redis } from "../../cache";

import { createConfirmEmailLink } from "../createConfirmEmailLink";
import { creatTypeormConnection } from "../createTpeconn";
import { User } from "../../entity/User";

let userId = "";
let url;

beforeAll(async () => {
	await creatTypeormConnection();
	const user: any = await User.create({
		email: "bobmanude@gmail.com",
		password: "asdfghjklpoiuytrew"
	}).save();
	userId = user.id;
	url = await createConfirmEmailLink(
		process.env.TEST_HOST as string,
		userId,
		redis
	);
});

describe("CONFIRMATION EMAILS", async () => {
	// @TEST 1
	it("createConfirmEmailLink Link works || OK RESPONSE && UPDATE USER CONFIRMED PROPERTY && DISABLE CONFIRMATION LINK AFTER USE", async () => {
		//  REQUEST THE CONFIRMATION EMAIL
		const response = await fetch(url);
		const text = await response.text();
		expect(text).toEqual("ok");
		// UPDATE CONFIRMATION PROPERTY
		const user = await User.findOne({ where: { id: userId } });
		expect(user.confirmed).toBeTruthy();
		// DELETE REDIS KEY
		const chunks = url.split("/");
		const chunks_key = chunks[chunks.length - 1];
		const redis_key_value = await redis.get(chunks_key);
		expect(redis_key_value).toBeNull();
	});

	it("createConfirmEmailLink Link works || INVALID RESPOSNE AFTER TEST 1", async () => {
		//  REQUEST THE CONFIRMATION EMAIL
		const response = await fetch(url);
		const text = await response.text();
		expect(text).toEqual("Invalid");
	});
});
