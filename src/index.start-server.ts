import "reflect-metadata";
import "dotenv/config";

import * as session from "express-session";
import * as connectRedis from "connect-redis";
import * as RateLimit from "express-rate-limit";
import * as RateLimitRedisStore from "rate-limit-redis";
import * as passport from "passport";

import { GraphQLServer } from "graphql-yoga";
import { creatTypeormConnection } from "./utils/createTpeconn";
import { redis } from "./cache";
import { confirmEmamil } from "./routes/confirmEmail";
import { genschema } from "./utils/generateSchema";
import { redisessionprefix } from "./constant";
import { Connection } from "typeorm";
import { oauthConfig } from "./Auth";
import { createTestConn } from "./test-utils/createTestConn";

const RedisStore = connectRedis(session);
const sessionSecret = "SECETEJAGDJVSHSKYG";

export const startServer = async () => {
	if (process.env.NODE_ENV === "test") {
		await redis.flushall();
	}
	// Graphql Server
	const server = new GraphQLServer({
		schema: genschema(),
		context: ({ request }) => ({
			redis,
			url: request.protocol + "://" + request.get("host"),
			session: request.session,
			req: request
		})
	});

	// Rate Limiting
	server.express.use(
		new RateLimit({
			store: new RateLimitRedisStore({
				client: redis as any
			}),
			windowMs: 15 * 60 * 1000, // 15 minutes
			max: 100 // limit each IP to 100 requests per windowMs
		})
	);

	// session redis config
	server.express.use(
		session({
			store: new RedisStore({
				client: redis as any,
				prefix: redisessionprefix
			}),
			name: "#BOT",
			secret: sessionSecret,
			resave: false,
			saveUninitialized: false,
			cookie: {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				maxAge: 1000 * 60 * 60 * 24 * 7
			}
		})
	);

	const cors = {
		credentials: true,
		origin:
			process.env.NODE_ENV === "test"
				? "*"
				: (process.env.FRONTEND_HOST as string)
	};

	server.express // GRAPHQL EXPRESS SERVER SETUP
		.get("/confirm/:id", confirmEmamil);

	// CREATE TYPEORM CONNECTION BASED ON PROCCESS.ENV{SETUP TEST DEV DB}
	const conn: Connection =
		process.env.NODE_ENV === "test"
			? await createTestConn(true)
			: await creatTypeormConnection();

	// Oauth || TWITTER
	oauthConfig(conn);
	/**
   * @desc   Initialize passport
   */
	server.express.use(passport.initialize());

	// Hnadle Twitter OA-uth:
	server.express.get("/auth/twitter", passport.authenticate("twitter"));

	server.express.get(
		"/auth/twitter/callback",
		passport.authenticate("twitter", {
			// failureRedirect: "/login",
			session: false
		}),
		(req, res) => {
			(req.session as any).userId = (req.user as any).id;
			// @redirect to fromtend
			res.redirect("/");
		}
	);

	const app = await server.start({
		cors,
		port: process.env.NODE_ENV === "test" ? 0 : 4000
	});
	console.log("Server is running on localhost:4000");
	return app;
};
