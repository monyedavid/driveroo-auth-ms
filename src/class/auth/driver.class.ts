import { DriverModel } from "../../models/Drivers";
import { Session } from "../../types/graphql-utile";
import { driverFirstUpdateschema } from "../../schema/driver.updates.schema.yup";
import { formatYupError } from "../../utils/formatYupError";
import { Bank } from "./bank.security";

export class DriverProfile {
    url?: string;
    constructor(url?: string) {
        this.url = url;
    }

    async firstUpdate(params: GQL.IUpDriverParams, session: Session) {
        // do the data validation
        try {
            await driverFirstUpdateschema.validate(params, {
                abortEarly: false
            });
        } catch (error) {
            return formatYupError(error);
        }

        const bvnVerfication: any = await new Bank()._resolveBvn(
            params.bank_bvn
        );

        console.log(bvnVerfication, "BVN VERIFICATION");

        if (bvnVerfication.status) {
            const updateData = {
                bank_: "",
                ...params,
                resolved_bvn_data: {
                    ...bvnVerfication.data
                }
            };

            const user: any = await DriverModel.findOne({
                _id: session.userId
            });
            if (user && user.active) {
                const updatedUser: any = await DriverModel.findOneAndUpdate(
                    { _id: session.userId },
                    { $set: updateData },
                    { new: true }
                );

                return [
                    {
                        active: updatedUser.active,
                        firstName: updatedUser.firstName,
                        lastName: updatedUser.lastName,
                        mobile: updatedUser.mobile,
                        email: updatedUser.email,
                        avatar: updatedUser.avatar,
                        dob: updatedUser.dob,
                        mothers_maiden_name: updatedUser.mothers_maiden_name,
                        primary_location: updatedUser.primary_location,
                        secondary_location: updatedUser.secondary_location,
                        tertiary_location: updatedUser.tertiary_location,
                        bvn: updatedUser.bank_bvn
                    }
                ];
            }
        } else {
            return [
                {
                    path: "Bank Verification",
                    message: `BVN verification failed :REASON: ${
                        bvnVerfication.message
                    }`
                }
            ];
        }

        return [
            {
                path: "User",
                message:
                    "This Profile has been de-activated or does not exist, contact an adminstrator for support"
            }
        ];
    }
}
