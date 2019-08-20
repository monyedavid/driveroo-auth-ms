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
            return { ok: false, error: formatYupError(error) };
        }

        const user: any = await DriverModel.findOne({
            _id: session.userId
        });

        if (user && user.active) {
            if (user.bank_bvn) {
                updateData = {
                    ...params
                };
            }

            if (!user.bank_bvn) {
                bvnVerfication = await new Bank()._resolveBvn(params.bank_bvn);
                if (!bvnVerfication.status) {
                    return {
                        ok: false,
                        error: [
                            {
                                path: "Bank Verification",
                                message: `BVN verification failed :REASON: ${
                                    bvnVerfication.message
                                }`
                            }
                        ]
                    };
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

            // FOR PRIMARY LOCATION
            let primary_location_fr: any;
            if (params.primary_location.includes("nigeria"))
                primary_location_fr = params.primary_location;

            if (!params.primary_location.includes("nigeria"))
                primary_location_fr =
                    params.primary_location.trim() + " nigeria";
            const primary_location_co_ordinates = await dms.retriveGeoCordinatedFreeform(
                { fft: primary_location_fr }
            );

            const plco =
                primary_location_co_ordinates.data.generateCo_ordinates[0];

            if (plco.__typename === "Error") {
                return {
                    ok: false,
                    error: [
                        {
                            path: plco.path,
                            message: `${plco.message} | @primary_location`
                        }
                    ]
                };
            }

            updateData.primary_location["Latitude"] =
                plco.co_ordinates.Latitude;

            updateData.primary_location["Longitude"] =
                plco.co_ordinates.Longitude;

            let sec_location_fr: any;
            if (params.secondary_location.includes("nigeria"))
                sec_location_fr = params.secondary_location;
            if (!params.primary_location.includes("nigeria"))
                sec_location_fr = params.secondary_location.trim() + " nigeria";

            const secondary_location_co_ordinates = await dms.retriveGeoCordinatedFreeform(
                { fft: sec_location_fr }
            );

            const slco =
                secondary_location_co_ordinates.data.generateCo_ordinates[0];

            if (slco.__typename === "Error") {
                return {
                    ok: false,
                    error: [
                        {
                            path: slco.path,
                            message: `${slco.message} | @seondary_location`
                        }
                    ]
                };
            }

            updateData.secondary_location["Latitude"] =
                plco.co_ordinates.Latitude;

            updateData.secondary_location["Longitude"] =
                plco.co_ordinates.Longitude;

            let tert_location_fr: any;
            if (params.secondary_location.includes("nigeria"))
                tert_location_fr = params.secondary_location;
            if (!params.primary_location.includes("nigeria"))
                tert_location_fr =
                    params.secondary_location.trim() + " nigeria";

            const tertiary_location_co_ordinates = await dms.retriveGeoCordinatedFreeform(
                { fft: tert_location_fr }
            );

            const tlco =
                tertiary_location_co_ordinates.data.generateCo_ordinates[0];

            if (tlco.__typename === "Error") {
                return {
                    ok: false,
                    error: [
                        {
                            path: tlco.path,
                            message: `${tlco.message} |@primary_location`
                        }
                    ]
                };
            }

            updateData.tertiary_location["Latitude"] =
                plco.co_ordinates.Latitude;

            updateData.tertiary_location["Longitude"] =
                plco.co_ordinates.Longitude;

            // INSERT INTO UPDATED DATA

            const updatedUser: any = await DriverModel.findOneAndUpdate(
                { _id: session.userId },
                { $set: updateData },
                { new: true }
            );

            return {
                ok: true,
                success: {
                    active: updatedUser.active,
                    confirmed: updatedUser.confirmed,
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
            };
        }

        return {
            ok: false,
            error: [
                {
                    path: "User",
                    message:
                        "This Profile has been de-activated or does not exist, contact an adminstrator for support"
                }
            ]
        };
    }
}
