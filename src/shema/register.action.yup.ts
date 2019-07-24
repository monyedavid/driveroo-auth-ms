import * as yup from "yup";
import {
	emailNotLongEnough,
	invalidEmail,
	passwordNotLongEnough
} from "../constant";

export const registerPasswordValidation = yup
	.string()
	.min(3, passwordNotLongEnough)
	.max(255);

export const schema = yup.object().shape({
	email: yup
		.string()
		.min(3, emailNotLongEnough)
		.max(255)
		.email(invalidEmail),
	password: registerPasswordValidation
});
