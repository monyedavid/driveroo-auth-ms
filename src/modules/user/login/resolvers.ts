// import { IResolvers } from "graphql-tools";
import * as bcrypt from "bcryptjs";
import { User } from "../../../entity/User";
import { ResolverMap } from "../../../types/graphql-utile";
import {
	invalidLogin,
	confirmEmailError,
	forgotPasswordLockError,
	userseesionidPrefix
} from "../../../constant";

const erroresponse = [
	{
		path: "email",
		message: invalidLogin
	}
];

export const resolvers: ResolverMap = {
	Query: {
		bye2: () => "THSES NUTS SON!"
	},

	Mutation: {
		login: async (
			_,
			{ email, password }: GQL.ILoginOnMutationArguments,
			{ redis, session, req }
		) => {
			const user = await User.findOne({ where: { email } });
			if (!user) {
				return erroresponse;
			}

			const valid = await bcrypt.compare(password, user.password);

			if (!valid) {
				return erroresponse;
			}

			if (!user.confirmed) {
				return [
					{
						path: "email",
						message: confirmEmailError
					}
				];
			}

			if (user.forgotPasswordLock) {
				return [
					{
						path: "email",
						message: forgotPasswordLockError
					}
				];
			}

			//  Login successfull
			// Assign Session

			session.userId = user.id;
			// create redis memory stack with `PREFIX + USERID` ==> AS KEY || VALUE : SESSIONID
			if (req.sessionID) {
				await redis.lpush(`${userseesionidPrefix}${user.id}`, req.sessionID);
			}

			return null;
		}
	}
};
