import { schema } from "../../schema/register.action.yup";
import { formatYupError } from "../../utils/formatYupError";
import { duplicateEmail } from "../../schema/schema.errors";
import { sendEmail } from "../../utils/sendEmail";
import { createConfirmEmailLink } from "../../utils/createConfirmEmailLink";
import { redis } from "../../cache";
import Models from "../../models/main.models.exports";
import { subject, confirmation } from "../../constants/registration.messages";

export class Auth {
    url: string;
    constructor(url: string) {
        this.url = url;
    }

    async register(body: any, model: string) {
        const { email, password } = body;

        try {
            await schema.validate(body, { abortEarly: false });
        } catch (error) {
            return formatYupError(error);
        }

        const userAlreadyExists = await Models[model].findOne({
            email
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
        const user = new Models[model]({
            email,
            password
        });

        await user.save();
        await sendEmail(
            user.email,
            await createConfirmEmailLink(this.url, user.id, redis),
            subject,
            confirmation
        );
        // console.log(url, "THIS URL GEN. FROM START_SERVER()")
        // console.log(link,)
        return null;
    }

    async login(body: any) {}

    public async me(body: any) {}

    public async logout(body: any) {}

    public async sendForgotPasswordEmailAndLockAccount(body: any) {}

    public async forgotPasswordChange(body: any) {}
}
