import * as mongoose from "mongoose";
import * as bcrypt from "bcryptjs";
const Schema = mongoose.Schema;

// Create Schema
const DriverSchema = new Schema(
    {
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
        avatar: {
            type: String
        },
        dob: {
            type: String
        },
        mothers_maiden_name: {
            type: String
        },
        primary_location: {
            address: String,
            landmark: String,
            city: String,
            state: String
        },
        secondary_location: {
            address: String,
            landmark: String,
            city: String,
            state: String
        },
        tertiary_location: {
            address: String,
            landmark: String,
            city: String,
            state: String
        },
        bank_bvn: {
            type: String
        },
        bank_account_number: {
            type: String
        },
        bank_code: {
            type: String
        },
        bank_firstname: {
            type: String
        },
        bank_middletname: {
            type: String
        },
        bank_lastname: {
            type: String
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
