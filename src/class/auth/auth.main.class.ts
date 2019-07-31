import * as bcrypt from "bcryptjs";
import { schema } from "../../schema/register.action.yup";
import { formatYupError } from "../../utils/formatYupError";
import {
    duplicateEmail,
    invalidLogin,
    forgotPasswordLockError
} from "../../schema/schema.errors";
import { sendEmail } from "../../utils/sendEmail";
import { createConfirmEmailLink } from "../../utils/createConfirmEmailLink";
import { redis } from "../../cache";
import Models from "../../models/main.models.exports";
import { subject, confirmation } from "../../constants/registration.messages";
import { confirmEmailError, userseesionidPrefix } from "../../constant";
import { Session } from "../../types/graphql-utile";

const erroresponse = [
    {
        path: "email",
        message: invalidLogin
    }
];

export class Auth {
    url: string;
    constructor(url?: string) {
        this.url = url;
    }

    async register(body: AUTH.IRegister, model: AUTH.model) {
        const { email } = body;

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
            ...body
        });

        await user.save();
        await sendEmail(
            user.email,
            await createConfirmEmailLink(this.url, user.id, redis, model),
            subject,
            confirmation
        );
        // console.log(url, "THIS URL GEN. FROM START_SERVER()")
        // console.log(link,)
        return [{ ok: true, path: "Register", message: "success" }];
    }

    async login(
        body: AUTH.ILogin,
        model: string,
        session: Session,
        sessionID: string
    ) {
        const { email, password } = body;
        let user;
        let multipleUser = [];

        if (model)
            user = await Models[model].findOne({
                email
            });

        if (!model) {
            let possible_user;

            possible_user = await Models["admin"].findOne({ email });
            // multipleUser
            if (possible_user)
                multipleUser.push({ userdata: possible_user, model: "admin" });

            possible_user = await Models["user"].findOne({ email });
            // multipleUser
            if (possible_user)
                multipleUser.push({ userdata: possible_user, model: "user" });

            possible_user = await Models["driver"].findOne({ email });
            // multipleUser
            if (possible_user)
                multipleUser.push({ userdata: possible_user, model: "driver" });

            if (multipleUser.length === 0) {
                return { ok: false, error: erroresponse };
            }

            // check if multipleUser > 1
            if (multipleUser.length === 1) {
                user = multipleUser[0].userdata;
            }

            if (multipleUser.length > 1) {
                const response = [];
                multipleUser.forEach(userObj => {
                    response.push({
                        path: "Login",
                        message: "Multplie Accounts Detected",
                        model: userObj.model
                    });
                });
            }
        }

        if (!user) {
            return { ok: false, error: erroresponse };
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            return { ok: false, error: erroresponse };
        }

        if (!user.confirmed) {
            return {
                ok: false,
                error: [
                    {
                        path: "email",
                        message: confirmEmailError
                    }
                ]
            };
        }

        if (user.forgotPasswordLock) {
            return {
                ok: false,
                error: [
                    {
                        path: "email",
                        message: forgotPasswordLockError
                    }
                ]
            };
        }

        //  Login successfull
        // Assign Session

        session.userId = user._id;
        session.userfullname = `${user.firstName} ${user.lastName}`;
        session.mobile = user.mobile;
        if (sessionID) {
            await redis.lpush(`${userseesionidPrefix}${user.id}`, sessionID);
        }

        return { ok: true };
    }

    public async me(body: any) {}

    public async logout(body: any) {}

    public async sendForgotPasswordEmailAndLockAccount(body: any) {}

    public async forgotPasswordChange(body: any) {}
}
