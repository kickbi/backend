import { USER_AUTH_PROVIDERS, USER_GENDER } from "../constants/user.constants";

export type TAuthProvider = (typeof USER_AUTH_PROVIDERS)[keyof typeof USER_AUTH_PROVIDERS];

export interface IEmailSignupRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string; //yyyy-mm-dd
    gender: (typeof USER_GENDER)[keyof typeof USER_GENDER];
}

export interface IEmailLoginRequest {
    email: string;
    password: string;
}


export interface IGoogleOAuthLoginCallbackRequest {
    iss: string;
    code: string;
    scope: string;
    authuser: string;
    prompt: string;
}

export interface IGoogleOAuthTokenVerificationResponse {
    access_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
    id_token: string;
}


export interface IGoogleUserInfo {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
}