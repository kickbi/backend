import mongoose from "mongoose";
import { USER_AUTH_PROVIDERS, USER_GENDER } from "../constants/user.constants";

export interface IUser {
    _id?: mongoose.Types.ObjectId;
    FirstName: string;
    LastName: string;
    FullName: string;
    DateOfBirth?: string; // format "YYYY-MM-DD"
    Gender?: (typeof USER_GENDER)[keyof typeof USER_GENDER];
    Email: string;
    Phone?: {
        Number: string;
        CountryCode: string;
    };
    IsEmailVerified: boolean;
    ProfilePicture?: string;
}

export interface IUserAuth {
    _id?: mongoose.Types.ObjectId;
    UserId: mongoose.Types.ObjectId;
    Email: string;
    AuthProvider: (typeof USER_AUTH_PROVIDERS)[keyof typeof USER_AUTH_PROVIDERS];
    PasswordHash?: string;
    PasswordSalt?: string;
}

export interface IUserSession {
    User: {
        _id: string | mongoose.Types.ObjectId;
        FirstName: string;
        LastName?: string;
        FullName: string;
        Email: string;
    };
}