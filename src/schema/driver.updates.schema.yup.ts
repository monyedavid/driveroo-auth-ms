import * as yup from "yup";

const locationSchema = yup.object().shape({
    address: yup.string(),
    landmark: yup.string(),
    city: yup.string(),
    state: yup.string()
});

const bank_ = yup.object().shape({
    account_number: yup.string(),
    account_name: yup.string(),
    name: yup.string()
});

export const driverFirstUpdateschema = yup.object().shape({
    dob: yup.string(),
    mothers_maiden_name: yup.string(),
    primary_location: yup.string(),
    secondary_location: yup.string(),
    tertiary_location: yup.string(),
    bank_bvn: yup
        .string()
        .min(11)
        .max(11),
    bank_: yup.array(bank_),
    avatar: yup.mixed()
});
