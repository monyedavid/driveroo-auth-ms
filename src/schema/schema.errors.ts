// Error Messages
export const invalidLogin = "inavlid login";
export const confirmEmailError = "Please confirm your email";
export const forgotPasswordLockError = "Account is Locked";
export const expiredKeyError = "Key has expired";
export const duplicateEmail = "A user already exists with this email";
export const emailNotLongEnough = "email must be at least 3 characters";
export const invalidEmail = "email must be a valid email";
export const passwordNotLongEnough = "password must be at least 3 characters";
export const userNotFoundError = "could not find user with that email";
export const LogoutError =
    "unable to logut user, most likely reason for seeig this is no user is logged in";
export const MeError = "No User Profile, Retry Login";
export const passwordTokenError =
    "password change token has expired | request a new one";

export const PATHS = {
    register: "register",
    login: "login",
    import: "File Import",
    me: "me",
    logout: "logout"
};

export const REASONS = {
    email: "check your mail",
    mongo: "mongo",
    user: "user",
    key: "key",
    validation: "validation",
    selection: "Incorrect selection"
};
