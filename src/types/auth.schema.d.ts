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
        email?: string;
        mobile?: string;
        password: string;
    }

    type _MultpleUser = {
        userdata: any;
        model: model;
    };

    type _MultpleUser_Response = {
        path: string;
        message: string;
        model: string;
    };

    type MultpleUser = Array<_MultpleUser>;

    type MultpleUser_Response = Array<_MultpleUser_Response>;

    type model = "user" | "admin" | "driver";

    interface IUserAdminLinkData {
        email: string;
        mobile: string;
    }
}
