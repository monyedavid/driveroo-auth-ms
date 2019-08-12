import * as bcrypt from "bcryptjs";
import { schema } from "../../schema/register.action.yup";
import { formatYupError } from "../../utils/formatYupError";
import {
    duplicateEmail,
    invalidLogin,
    forgotPasswordLockError,
    duplicateMobile
} from "../../schema/schema.errors";
import { sendEmail } from "../../utils/sendEmail";
import { createConfirmEmailLink } from "../../utils/createConfirmEmailLink";
import { redis } from "../../cache";
import Models from "../../models/main.models.exports";
import { subject, confirmation } from "../../constants/registration.messages";
import { confirmEmailError, userseesionidPrefix } from "../../constant";
import { Session } from "../../types/graphql-utile";
import { signTokenStore } from "../../utils/generateTohen";

const erroresponse = [
    {
        path: "email",
        message: invalidLogin
    }
];

export class Auth {
    url?: string;
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

        const userAlreadyExistsMobile = await Models[model].findOne({
            email
        });

        if (userAlreadyExistsMobile)
            return [
                {
                    path: "email",
                    message: duplicateMobile
                }
            ];

        if (userAlreadyExists)
            return [
                {
                    path: "email",
                    message: duplicateEmail
                }
            ];

        // const hashedPassword = await bcrypt.hash(password, 10);
        const user: any = new Models[model]({
            ...body
        } as any);

        await user.save();
        await sendEmail(
            user.email,
            await createConfirmEmailLink(
                this.url as any,
                user.id,
                redis,
                model
            ),
            subject,
            confirmation
        );
        // console.log(url, "THIS URL GEN. FROM START_SERVER()")
        // console.log(link,)
        return [
            {
                ok: true,
                path: "Register",
                message: `A mail has been sent to email @${email}, please use the link provided to confirm email`
            }
        ];
    }

    async login(
        body: AUTH.ILogin,
        session: Session,
        sessionID: string,
        model?: string
    ) {
        const { email, password, mobile } = body;
        let user: any;
        const multipleUser: AUTH.MultpleUser = [];

        if (model) {
            if (email) {
                user = await Models[model].findOne({
                    email
                });
            }

            if (mobile)
                user = await Models[model].findOne({
                    mobile
                });
        }

        if (!model) {
            let possible_user;

            if (email) {
                possible_user = await Models["admin"].findOne({ email });
                // multipleUser
                if (possible_user)
                    multipleUser.push({
                        userdata: possible_user,
                        model: "admin"
                    });

                possible_user = await Models["user"].findOne({ email });
                // multipleUser
                if (possible_user)
                    multipleUser.push({
                        userdata: possible_user,
                        model: "user"
                    });

                possible_user = await Models["driver"].findOne({ email });
            }

            if (mobile) {
                possible_user = await Models["admin"].findOne({ mobile });
                // multipleUser
                if (possible_user)
                    multipleUser.push({
                        userdata: possible_user,
                        model: "admin"
                    });

                possible_user = await Models["user"].findOne({ mobile });
                // multipleUser
                if (possible_user)
                    multipleUser.push({
                        userdata: possible_user,
                        model: "user"
                    });

                possible_user = await Models["driver"].findOne({ mobile });
            }
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
                const response: AUTH.MultpleUser_Response = [];
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
        session.model = model ? model : (multipleUser[0].model as any);
        session.token = await signTokenStore({
            _id: user._id,
            userfullname: `${user.firstName} ${user.lastName}`,
            mobile: user.mobile,
            model: model ? model : multipleUser[0].model
        });

        if (sessionID) {
            await redis.lpush(`${userseesionidPrefix}${user.id}`, sessionID);
        }

        return { ok: true };
    }

    public async me(session: Session) {
        if (session.userId && session.model) {
            const user = (await Models[session.model].findOne({
                _id: session.userId
            })) as any;

            if (user) {
                return {
                    ok: true,
                    user: {
                        active: user.active,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        mobile: user.mobile,
                        email: user.email,
                        avatar: user.avatar
                    },
                    token: session.token
                };
            }
        }

        return {
            ok: false,
            error: {
                path: "me",
                message: "No user is logged in, please log in to continue"
            }
        };
    }

    public async logout(body: any) {}

    public async sendForgotPasswordEmailAndLockAccount(body: any) {}

    public async forgotPasswordChange(body: any) {}
}
