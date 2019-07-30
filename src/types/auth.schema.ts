declare namespace AUTH {
    interface IRegister {
        email: string;
        firstName: string;
        lastName: string;
        mobile: string;
        password: string;
        confirmed?: Boolean;
        forgotPasswordLock?: Boolean;
        avatar?: string;
    }

    interface ILogin {
        email: string;
        password: string;
    }

    type model = "user" | "admin" | "driver";
}
