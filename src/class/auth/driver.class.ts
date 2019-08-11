import { DriverModel } from "../../models/Drivers";
import { Session } from "../../types/graphql-utile";
import { driverFirstUpdateschema } from "../../schema/driver.updates.schema.yup";
import { formatYupError } from "../../utils/formatYupError";
import { Bank } from "./bank.security";
import { DriverMs } from "../../cluster/Graphql/driver.class";
import { inProd } from "../../index.start-server";

export class DriverProfile {
    url?: string;
    constructor(url?: string) {
        this.url = url;
    }

    async firstUpdate(params: GQL.IUpDriverParams, session: Session) {
        let updateData;
        let bvnVerfication;
        // do the data validation
        try {
            await driverFirstUpdateschema.validate(params, {
                abortEarly: false
            });
        } catch (error) {
            return formatYupError(error);
        }

        const user: any = await DriverModel.findOne({
            _id: session.userId
        });

        if (user && user.active) {
            if (user.bank_bvn) {
                console.log("ME | YOU");
                updateData = {
                    ...params
                };
            }

            if (!user.bank_bvn) {
                console.log("YOU | SHOULDNT SEE ME");
                bvnVerfication = await new Bank()._resolveBvn(params.bank_bvn);
                if (!bvnVerfication.status) {
                    return [
                        {
                            path: "Bank Verification",
                            message: `BVN verification failed :REASON: ${
                                bvnVerfication.message
                            }`
                        }
                    ];
                }

                updateData = {
                    ...params,
                    resolved_bvn_data: {
                        ...bvnVerfication.data
                    }
                };
            }

            // SPREAD INTO UPDATED PARAMS THE CO-ORDINATES OF PRIMARY SECONDARY AND TERTIARY LOCATIONS
            let dms: DriverMs;
            if (!inProd) {
                dms = new DriverMs(session, "http://localhost:4100");
            }

            if (inProd) {
                dms = new DriverMs(session);
            }

            // console.log(
            //     co_ord.data.generateCo_ordinates,
            //     "LOCATION CO-ORDINATES"
            // );
            // FOR PRIMARY LOCATION
            const primary_location_co_ordinates = await dms.retrieveGeoCordinates(
                {
                    country: "nigeria",
                    city: "lagos",
                    housenumber: "20",
                    street: "ikorodu"
                }
            );

            const secondary_location_co_ordinates = await dms.retrieveGeoCordinates(
                {
                    country: "nigeria",
                    city: "lagos",
                    housenumber: "20",
                    street: "ikorodu"
                }
            );

            const tertiary_location_co_ordinates = await dms.retrieveGeoCordinates(
                {
                    country: "nigeria",
                    city: "lagos",
                    housenumber: "20",
                    street: "ikorodu"
                }
            );

            // INSERT INTO UPDATED DATA

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
                    bvn: updatedUser.bank_bvn,
                    bank_: updatedUser.bank_
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
