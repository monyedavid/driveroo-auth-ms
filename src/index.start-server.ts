import "reflect-metadata";
import "dotenv/config";

import * as session from "express-session";
import * as connectRedis from "connect-redis";
import * as RateLimit from "express-rate-limit";
import * as RateLimitRedisStore from "rate-limit-redis";
import * as passport from "passport";
import * as mongoose from "mongoose";

import { GraphQLServer } from "graphql-yoga";

import { redis } from "./cache";
import { confirmEmamil } from "./routes/confirmEmail";
import { genschema } from "./utils/generateSchema";
import { redisessionprefix } from "./constant";

import { oauthConfig } from "./Auth";

const RedisStore = connectRedis(session);
const sessionSecret = process.env.SESSION_SECRET as string;
const inProd = process.env.NODE_ENV === "production";

export const startServer = async () => {
    // ESTABLISH MONGOOSE CONNECTIONS
    mongoose
        .connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useCreateIndex: true
        })
        .then(() => console.log("MDB connected"))
        .catch(err => console.log(err));

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
    // session redis config
    server.express.set("trust proxy", 1); // trust first proxy
    server.express.use(
        session({
            store: new RedisStore({
                client: redis as any,
                prefix: redisessionprefix
            }),
            name: "DRIVER#BOT",
            secret: sessionSecret,
            resave: false,
            saveUninitialized: true,
            cookie: {
                httpOnly: !inProd,
                maxAge: 1000 * 60 * 60 * 24 * 7,
                secure: false
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
        .get("/confirm/:type/:id", confirmEmamil);

    // Oauth || TWITTER
    // oauthConfig(conn);

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

    const port = process.env.PORT || 4000;

    const app = await server.start({
        cors,
        port
    });
    console.log("Server is running on localhost:4000");
    return app;
};
