import { formatYupError } from "../../utils/formatYupError";
import { createAdminRegistrationLink } from "../../schema/register.action.yup";
import { AdminRegistratonLink } from "../../utils/admin.reg.create.link";
import { redis } from "../../cache";
import { sendEmail } from "../../utils/sendEmail";

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
                mssg: `Administration Link has been sent employee at ${email}`
            }
        ];
    }
}
