import * as yup from "yup";

export const driverUpdateschema = yup.object().shape({
    dob: yup.string(),
    mothers_maiden_name: yup.string(),
    primary_location: yup.string(),
    secondary_location: yup.string(),
    tertiary_location: yup.string(),
    bank_bvn: yup.string(),
    bank_account_number: yup.string(),
    bank_code: yup.string(),
    bank_firstname: yup.string(),
    bank_middletname: yup.string(),
    bank_lastname: yup.string()
});
