import { TAuthProvider } from "../../interface/auth.interface"
import { IUser, IUserAuth } from "../../interface/user.interface";
import UserAuth from "../../models/users/userAuth.model"

export const fetchUserAuthByEmailAndAuthProvider = async (email: string, authProvider: TAuthProvider) => {
    const userAuth = await UserAuth.findOne({
        Email: email,
        AuthProvider: authProvider,
    })
    return userAuth;
}

export const fetchUserAuthByEmail = async (email: string) => {
    const userAuth = await UserAuth.findOne({
        Email: email,
    })
    return userAuth;
}


export const addUserAuth = async (userAuthDetails: IUserAuth) => {
    return await UserAuth.create(userAuthDetails);
}