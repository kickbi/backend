import mongoose from "mongoose";
import { IUser } from "../../interface/user.interface";
import User from "../../models/users/user.model";

export const addUser = async function (userDetails: IUser) {
    const user = await User.create(userDetails);
    return user;
};


export const fetchUserById = async (userId: string | mongoose.Types.ObjectId) => {
    const user = await User.findById(userId);
    return user;
};