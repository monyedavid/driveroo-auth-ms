import { Auth } from "./auth.main.class";

export class DriverAuth {
    url: string;
    constructor(url?: string) {
        this.url = url;
    }

    async register(params: AUTH.IRegister) {
        const service = new Auth(this.url);
        return await service.register(params, "driver");
    }

    async login(params: any) {}

    public async me(params: any) {}

    public async logout(params: any) {}

    public async sendForgotPasswordEmailAndLockAccount(params: any) {}

    public async forgotPasswordChange(params: any) {}
}
