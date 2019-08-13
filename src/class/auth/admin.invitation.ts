import { formatYupError } from "../../utils/formatYupError";
import { createAdminRegistrationLink } from "../../schema/register.action.yup";
import { AdminRegistratonLink } from "../../utils/admin.reg.create.link";
import { redis } from "../../cache";
import { sendEmail } from "../../utils/sendEmail";
import { AdminModel } from "../../models/Admin";

export class UAdmin {
    url: string;
    constructor(url: string) {
        this.url = url;
    }

    /**
     * cREATE LINK FOR NEW SUPERVISOR ACCOUNT
     * REF CLIENT REGISTER
     */
    public async registerNewUser({ email, mobile }: AUTH.IUserAdminLinkData) {
        try {
            await createAdminRegistrationLink.validate(
                { email },
                { abortEarly: false }
            );
        } catch (error) {
            return formatYupError(error);
        }

        // find user
        const emaiuser = await AdminModel.findOne({
            email
        });

        // find user
        const mobileUser = await AdminModel.findOne({
            mobile
        });

        if (mobile)
            return [
                {
                    path: "mobile",
                    message: `n admin with this mobile number ${mobile} alraedy exists`
                }
            ];

        if (mobile)
            return [
                {
                    path: "email",
                    message: `An admin with this email address ${email} alraedy exists`
                }
            ];
        // create admin registartion link
        const arl = await AdminRegistratonLink(
            this.url,
            { email, mobile },
            redis
        );
        await sendEmail(
            email,
            arl,
            "Driveroo Administrator Invitation",
            "Hi please use the link to register your administrator account"
        );

        return [
            {
                ok: true,
                mssg: `Administration Link [${arl}] has been sent employee at ${email}`
            }
        ];
    }
}
