import { DriverModel } from "../../models/Drivers";
import { Session } from "../../types/graphql-utile";

export class DriverProfile {
    url?: string;
    constructor(url?: string) {
        this.url = url;
    }

    async update(params: GQL.IUpDriverParams, session: Session) {
        // do the bvn verificactiongitgu
        const user: any = await DriverModel.findOne({ _id: session.userId });
        if (user && user.active) {
            const updatedUser:any = await DriverModel.findOneAndUpdate(
                { _id: session.userId },
                { $set: params },
                { new: true }
            );

            return {
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
                bvn: updatedUser.bvn
            };
        }

        return {
            path: "User",
            message:
                "This Profile has been de-activated or does not exist, contact an adminstrator for support"
        };
    }
}
