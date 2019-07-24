// passport initialize
import * as passport from "passport";

import { Strategy } from "passport-twitter";
import { User } from "../entity/User";
import { Connection } from "typeorm";

export const oauthConfig = async (conn: Connection) => {
	passport.use(
		new Strategy(
			{
				consumerKey: "JV0TEfprH6xegbOkCokGmfbY3", // process.env.TWITTER_API_KEY as string,
				consumerSecret: "bVRfxkPq4AD7zWiS4obstGkQbs8tmY2ADJPoXKTII0XicPQYN7", // process.env.TWITTER_API_SECRET_KEY as string,
				callbackURL: "http://localhost:4000/auth/twitter/callback",
				includeEmail: true
			},
			async (_, __, profile, cb) => {
				const { id, emails } = profile;

				//  QUERYT
				const query = conn
					.getRepository(User)
					.createQueryBuilder("user")
					.where("user.twitterId = :id", { id });

				let email: string | null = null;
				if (emails) {
					email = emails[0].value;
					query.orWhere("user.email = :email", { email });
				}

				let user = await query.getOne();

				if (!user) {
					user = await User.create({
						twitterId: id,
						email
					}).save();
				} else if (!user.twitterId) {
					// merge account
					// we found the user by email
					user.twitterId = id;
					await user.save();
				} else {
					// we have a twitter ID
					// login
					console.log("loginning");
				}

				return cb(null, { id: user.id });
			}
		)
	);
};
