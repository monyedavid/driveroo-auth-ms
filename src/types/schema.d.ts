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
previousUser: IPreviousUserResponse;
bye3: string | null;
bye2: string | null;
dummy: string | null;
me: me_response | null;
bye: string | null;
}

interface IPreviousUserOnQueryArguments {
email?: string | null;
mobile?: string | null;
}

interface IPreviousUserResponse {
__typename: "previousUserResponse";
ok: boolean | null;
gotMail: boolean | null;
gotMobile: boolean | null;
user: IMiniUser | null;
error: IError | null;
}

interface IMiniUser {
__typename: "MiniUser";
firstName: string;
lastName: string;
email: string;
mobile: string;
}

interface IError {
__typename: "Error";
path: string | null;
message: string | null;
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
confirmed: boolean | null;
}

interface IMutation {
__typename: "Mutation";
firstUpdate: IDriverResponse;
admin_: Array<admin_response> | null;
admin_link_register: IDefResponse;
sendForgotPasswordEmail: Array<IError> | null;
forgotPasswordChange: Array<IError> | null;
login: Array<IDefLoginResponse> | null;
logout: boolean | null;
register: IDefResponse;
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
primary_location: string;
secondary_location: string;
tertiary_location: string;
bank_bvn: string;
bank_?: Array<IUpDriverParamsBank | null> | null;
avatar: any;
driversLicense: any;
}

interface IUpDriverParamsBank {
account_number?: string | null;
account_name?: string | null;
name?: string | null;
}

interface IDriverResponse {
__typename: "driver_Response";
ok: boolean;
error: Array<IError> | null;
success: IDriver | null;
}

interface IDriver {
__typename: "Driver";
active: boolean | null;
confirmed: boolean | null;
incompleteProfile: boolean | null;
firstName: string | null;
lastName: string | null;
mobile: string | null;
email: string | null;
avatar: string | null;
dob: string | null;
mothers_maiden_name: string | null;
primary_location: string | null;
secondary_location: string | null;
tertiary_location: string | null;
primary_location_co_ord: ICoOrdinates | null;
secondary_location_co_ord: ICoOrdinates | null;
tertiary_location_co_ord: ICoOrdinates | null;
bvn: string | null;
}

interface ICoOrdinates {
__typename: "Co_ordinates";
Longitude: string | null;
Latitude: string | null;
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
ok: boolean;
error: Array<IError> | null;
success: Array<IGenericResponse> | null;
}

interface IGenericResponse {
__typename: "GenericResponse";
path: string;
message: string;
}

interface IDefLoginResponse {
__typename: "def_Login_Response";
path: string | null;
message: string | null;
incompleteProfile: boolean | null;
confirmed: boolean | null;
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

interface IUpDriverParamsLocation {
address: string;
landmark: string;
city: string;
country?: string | null;
state: string;
housenumber: string;
street: string;
}

interface IUserr {
__typename: "Userr";
id: string;
email: string;
}
}

// tslint:enable
