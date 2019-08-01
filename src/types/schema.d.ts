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
user: IUser | null;
token: string | null;
}

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
updateProfile: driver_Response | null;
sendForgotPasswordEmail: Array<IError> | null;
forgotPasswordChange: Array<IError> | null;
login: Array<IDefLoginResponse> | null;
logout: boolean | null;
register: Array<IDefResponse> | null;
}

interface IUpdateProfileOnMutationArguments {
params: IUpDriverParams;
}

interface ISendForgotPasswordEmailOnMutationArguments {
email: string;
}

interface IForgotPasswordChangeOnMutationArguments {
newPassword: string;
key: string;
}

interface ILoginOnMutationArguments {
email: string;
password: string;
model?: string | null;
}

interface IRegisterOnMutationArguments {
params: IRegParams;
model: string;
}

interface IUpDriverParams {
dob?: string | null;
mothers_maiden_name?: string | null;
primary_location?: IDuLocation | null;
secondary_location?: IDuLocation | null;
tertiary_location?: IDuLocation | null;
bvn?: string | null;
}

interface IDuLocation {
__typename: "du_Location";
address: string | null;
landmark: string | null;
city: string | null;
state: string | null;
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

interface IDefLoginResponse {
__typename: "def_Login_Response";
path: string;
message: string;
model: string | null;
}

interface IRegParams {
email: string;
password: string;
firstName: string;
lastName: string;
mobile: string;
}

interface IDefResponse {
__typename: "def_Response";
ok: boolean | null;
path: string;
message: string;
}

interface IUpDriverParamsLocation {
address?: string | null;
landmark?: string | null;
city?: string | null;
state?: string | null;
}

interface IUserr {
__typename: "Userr";
id: string;
email: string;
}
}

// tslint:enable
