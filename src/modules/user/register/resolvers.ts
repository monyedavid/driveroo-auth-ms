// import { IResolvers } from "graphql-tools";
// import * as bcrypt from "bcryptjs";
import { ResolverMap } from "../../../types/graphql-utile";
import { User } from "../../../entity/User";
import { formatYupError } from "../../../utils/formatYupError";
import { duplicateEmail } from "../../../constant";
import { createConfirmEmailLink } from "../../../utils/createConfirmEmailLink";
import { sendEmail } from "../../../utils/sendEmail";
import { schema } from "../../../shema/register.action.yup";

export const resolvers: ResolverMap = {
	Query: {
		bye: () => "THSES NUTS SON!"
	},

	Mutation: {
		register: async (
			_,
			args: GQL.IRegisterOnMutationArguments,
			{ redis, url }
		) => {
			const { email, password } = args;

			try {
				await schema.validate(args, { abortEarly: false });
			} catch (error) {
				return formatYupError(error);
			}

			const userAlreadyExists = await User.findOne({
				where: { email },
				select: ["id"]
			});

			if (userAlreadyExists) {
				return [
					{
						path: "email",
						message: duplicateEmail
					}
				];
			}

			// passowrd hash handled by typeorm entity
			// const hashedPassword = await bcrypt.hash(password, 10);
			const user = User.create({
				email,
				password
			});

			await user.save();
			if (process.env.NODE_ENV !== "test") {
				await sendEmail(
					user.email,
					await createConfirmEmailLink(url, user.id, redis)
				);
			}
			// console.log(url, "THIS URL GEN. FROM START_SERVER()")
			// console.log(link,)
			return null;
		}
	}
};
