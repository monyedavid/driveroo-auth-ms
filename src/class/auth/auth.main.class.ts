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

function genNoUserErrorResponse(loginwith: AUTH.loginwith) {
    if (loginwith === "email")
        return [
            {
                path: "email",
                message: invalidLogin
            }
        ];

    return [
        {
            path: "mobile",
            message: invalidLogin
        }
    ];
}

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
        const { email, mobile } = body;

        try {
            await schema.validate(body, { abortEarly: false });
        } catch (error) {
            return { ok: false, error: formatYupError(error) };
        }

        const userAlreadyExists = await Models[model].findOne({
            email
        });

        const userAlreadyExistsMobile = await Models[model].findOne({
            mobile
        });

        if (userAlreadyExistsMobile)
            return {
                ok: false,
                error: [
                    {
                        path: "mobile",
                        message: duplicateMobile
                    }
                ]
            };

        if (userAlreadyExists)
            return {
                ok: false,
                error: [
                    {
                        path: "email",
                        message: duplicateEmail
                    }
                ]
            };

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

        return {
            ok: true,
            success: [
                {
                    path: "Register",
                    message: `A mail has been sent to email @${email}, please use the link provided to confirm email`
                }
            ]
        };
    }

    async login(
        body: AUTH.ILogin,
        session: Session,
        sessionID: string,
        model?: string
    ) {
        const { email, password, mobile } = body;
        let user: any;
        let loginwith: AUTH.loginwith;
        const multipleUser: AUTH.MultpleUser = [];

        if (model) {
            if (email) {
                loginwith = "email";
                user = await Models[model].findOne({
                    email
                });
            }

            if (mobile) {
                loginwith = "mobile";
                user = await Models[model].findOne({
                    mobile
                });
            }
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
            return { ok: false, error: genNoUserErrorResponse(loginwith) };
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            return { ok: false, error: erroresponse };
        }

        // if (!user.confirmed) {
        //     return {
        //         ok: false,
        //         error: [
        //             {
        //                 path: "email",
        //                 message: confirmEmailError
        //             }
        //         ]
        //     };
        // }

        if (user.forgotPasswordLock) {
            return {
                ok: false,
                error: [
                    {
                        path: "password",
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

        const returnData = {
            ok: true,
            sessionId: sessionID,
            model: session.model
        };

        if (model === "driver") {
            returnData["confirmed"] = user.confirmed;
            returnData["incompleteProfile"] =
                user.driversLicense && user.avatar ? false : true;
        }

        return returnData;
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
                        avatar: user.avatar,
                        confirmed: user.confirmed
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

    public async previousUser({ email, mobile }, model: string = "driver") {
        if (email) {
            const userWithMail = await Models[model].findOne({
                email
            });

            if (userWithMail)
                return {
                    ok: true,
                    user: {
                        firstName: userWithMail.firstName,
                        lastName: userWithMail.lastName,
                        email,
                        mobile: userWithMail.mobile
                    },
                    gotMail: true
                };
            if (!userWithMail)
                return {
                    ok: true,
                    gotMail: false
                };
        }

        if (mobile) {
            const userWithMobile = await Models[model].findOne({
                mobile
            });

            if (userWithMobile)
                return {
                    ok: true,
                    user: {
                        firstName: userWithMobile.firstName,
                        lastName: userWithMobile.lastName,
                        email: userWithMobile.email,
                        mobile
                    },
                    gotMobile: true
                };
            if (!userWithMobile)
                return {
                    ok: true,
                    gotMobile: false
                };
        }

        return {
            ok: false,
            error: [
                {
                    path: "Validation",
                    message: "An error occured while validating credentials"
                }
            ]
        };
    }

    public async sendForgotPasswordEmailAndLockAccount(body: any) {}

    public async forgotPasswordChange(body: any) {}
}
