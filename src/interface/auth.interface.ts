import { USER_AUTH_PROVIDERS, USER_GENDER } from "../constants/user.constants";

export type TAuthProvider = (typeof USER_AUTH_PROVIDERS)[keyof typeof USER_AUTH_PROVIDERS];

export interface IEmailLoginRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string; //yyyy-mm-dd
    gender: (typeof USER_GENDER)[keyof typeof USER_GENDER];
}

