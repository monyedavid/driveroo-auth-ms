import * as yup from "yup";

const locationSchema = yup.object().shape({
    address: yup.string(),
    landmark: yup.string(),
    city: yup.string(),
    state: yup.string()
});

export const driverFirstUpdateschema = yup.object().shape({
    dob: yup.string(),
    mothers_maiden_name: yup.string(),
    primary_location: locationSchema,
    secondary_location: locationSchema,
    tertiary_location: locationSchema,
    bank_bvn: yup
        .string()
        .min(11)
        .max(11),
    bank_account_number: yup.string(),
    bank_code: yup.string(),
    bank_firstname: yup.string(),
    bank_middletname: yup.string(),
    bank_lastname: yup.string()
});
