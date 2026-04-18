import { IUser } from "../../interface/user.interface";
import User from "../../models/users/user.model";

export const addUser = async function (userDetails: IUser) {
    const user = await User.create(userDetails);
    return user;
};
