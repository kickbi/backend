import { TAuthProvider } from "../../interface/auth.interface"
import { IUser, IUserAuth } from "../../interface/user.interface";
import User from "../../models/users/user.model";
import UserAuth from "../../models/users/userAuth.model"

export const fetchUserAuthByEmail = async (email: string, authProvider: TAuthProvider) => {
    const userAuth = await UserAuth.findOne({
        Email: email,
        AuthProvider: authProvider,
    })
    return userAuth;
}

export const addUserAuth = async (userAuthDetails: IUserAuth) => {
    return await UserAuth.create(userAuthDetails);
}