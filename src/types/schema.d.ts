// tslint:disable
// graphql typescript definitions

declare namespace GQL {
interface IGraphQLResponseRoot {
data?: IQuery | IMutation;
errors?: Array<IGraphQLResponseError>;
}

interface IGraphQLResponseError {
/** Required for all errors */
message: string;
locations?: Array<IGraphQLResponseErrorLocation>;
/** 7.2.2 says 'GraphQL servers may provide additional entries to error' */
[propName: string]: any;
}

interface IGraphQLResponseErrorLocation {
line: number;
column: number;
}

interface IQuery {
__typename: "Query";
bye3: string | null;
bye2: string | null;
dummy: string | null;
me: me_response | null;
bye: string | null;
}

type me_response = IMeData | IError;



interface IMeData {
__typename: "me_data";
user: User | null;
token: string | null;
}

type User = IDriver;

interface IUser {
__typename: "User";
active: boolean | null;
firstName: string | null;
lastName: string | null;
mobile: string | null;
email: string | null;
avatar: string | null;
}

interface IError {
__typename: "Error";
path: string;
message: string;
}

interface IMutation {
__typename: "Mutation";
firstUpdate: Array<driver_Response> | null;
admin_: Array<admin_response> | null;
admin_link_register: Array<IDefResponse> | null;
sendForgotPasswordEmail: Array<IError> | null;
forgotPasswordChange: Array<IError> | null;
login: Array<IDefLoginResponse> | null;
logout: boolean | null;
register: Array<IDefResponse> | null;
}

interface IFirstUpdateOnMutationArguments {
params: IUpDriverParams;
}

interface IAdminOnMutationArguments {
params: IAdminLinkParams;
}

interface IAdminLinkRegisterOnMutationArguments {
params: IRegParamsAdminLInk;
}

interface ISendForgotPasswordEmailOnMutationArguments {
email: string;
}

interface IForgotPasswordChangeOnMutationArguments {
newPassword: string;
key: string;
}

interface ILoginOnMutationArguments {
emailormobile: string;
password: string;
model?: string | null;
}

interface IRegisterOnMutationArguments {
params: IRegParams;
model: string;
}

interface IUpDriverParams {
dob: string;
mothers_maiden_name: string;
primary_location: IUpDriverParamsLocation;
secondary_location: IUpDriverParamsLocation;
tertiary_location: IUpDriverParamsLocation;
bank_bvn: string;
bank_?: Array<IUpDriverParamsBank | null> | null;
}

interface IUpDriverParamsLocation {
address: string;
landmark: string;
city: string;
country?: string | null;
state: string;
housenumber: string;
street: string;
}

interface IUpDriverParamsBank {
account_number?: string | null;
account_name?: string | null;
name?: string | null;
}

type driver_Response = IDriver | IError;



interface IDriver {
__typename: "Driver";
active: boolean | null;
firstName: string | null;
lastName: string | null;
mobile: string | null;
email: string | null;
avatar: string | null;
dob: string | null;
mothers_maiden_name: string | null;
primary_location: IDuLocation | null;
secondary_location: IDuLocation | null;
tertiary_location: IDuLocation | null;
bvn: string | null;
}

interface IDuLocation {
__typename: "du_Location";
address: string | null;
landmark: string | null;
city: string | null;
country: string | null;
state: string | null;
Longitude: string | null;
Latitude: string | null;
housenumber: string | null;
street: string | null;
}

interface IAdminLinkParams {
email: string;
mobile: string;
}

type admin_response = IAdmin | IError;



interface IAdmin {
__typename: "_admin";
ok: string | null;
mssg: string | null;
}

interface IRegParamsAdminLInk {
encrypt_id: string;
password: string;
firstName: string;
lastName: string;
}

interface IDefResponse {
__typename: "def_Response";
ok: boolean | null;
path: string;
message: string;
}

interface IDefLoginResponse {
__typename: "def_Login_Response";
path: string | null;
message: string | null;
sessionId: string | null;
model: string | null;
}

interface IRegParams {
email: string;
password: string;
firstName: string;
lastName: string;
mobile: string;
}

interface IUserr {
__typename: "Userr";
id: string;
email: string;
}
}

// tslint:enable
