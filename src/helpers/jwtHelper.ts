import * as Crypto from "crypto";
import jwt from "jsonwebtoken";
import { SESSION_EXPIRED } from "../messages/response.messages";
import { IUserSession } from "../interface/user.interface";

export const generateJWT = (payload: object) => {
    const secretKey = String(process.env.JWT_SECRET_KEY);

    const token = jwt.sign(payload, secretKey, {
        expiresIn: "1h", // Token expires in 1 hour
    });
    return token;
}


export const verifyJWT = (token: string) => {
    const secretKey = String(process.env.JWT_SECRET_KEY);
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded as IUserSession;
    } catch (error) {
        throw new Error(SESSION_EXPIRED);
    }
}