import * as mongoose from "mongoose";
import * as bcrypt from "bcryptjs";
const Schema = mongoose.Schema;

const DriverReview = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "EmplyeeUsers"
    },
    rate: {
        type: String
    },
    message: String
});

const bankDetailsSchema = new Schema({
    account_number: {
        type: String
    },
    account_name: {
        type: String
    },
    name: {
        type: String
    }
});

const LocationSchema = new Schema({
    address: String,
    landmark: String,
    city: String,
    country: {
        type: String,
        default: "nigeria"
    },
    state: String,
    Longitude: String,
    Latitude: String,
    housenumber: String,
    street: String
});

// Create Schema
const DriverSchema = new Schema(
    {
        avatar: {
            type: String
        },
        driversLicense: {
            type: String
        },
        active: {
            type: Boolean,
            required: true,
            default: true
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        mobile: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        confirmed: {
            type: Boolean,
            required: true,
            default: false
        },
        forgotPasswordLock: {
            type: Boolean,
            required: true,
            default: false
        },
        dob: {
            type: String
        },
        mothers_maiden_name: {
            type: String
        },
        primary_location: { type: String },
        secondary_location: { type: String },
        tertiary_location: { type: String },
        primary_location_co_ord: {
            Longitude: String,
            Latitude: String
        },
        secondary_location_co_ord: {
            Longitude: String,
            Latitude: String
        },
        tertiary_location_co_ord: {
            Longitude: String,
            Latitude: String
        },
        bank_: [bankDetailsSchema],
        bank_bvn: {
            type: String
        },
        resolved_bvn_data: {
            first_name: {
                type: String
            },
            last_name: {
                type: String
            },
            dob: {
                type: String
            },
            mobile: {
                type: String
            },
            bvn: { type: String }
        },
        driver_reviews: [DriverReview],
        driver_rating: {
            type: String
        },
        last_seen: {
            Longitude: String,
            Latitude: String,
            timeStamp: String
        }
    },
    { timestamps: true }
);

/**
 *   @BeforeInsert()
 */

const hashedPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
};

DriverSchema.pre("save", async function() {
    if (this.isNew) {
        const newpassword = await hashedPassword((this as any).password);
        (this as any).password = newpassword;
    }
});

export const DriverModel = mongoose.model("DriverUsers", DriverSchema);
