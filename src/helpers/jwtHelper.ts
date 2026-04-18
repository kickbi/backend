import * as Crypto from "crypto";
import jwt from "jsonwebtoken";

export const generateJWT = (payload: object) => {
    const secretKey = String(process.env.JWT_SECRET_KEY);

    const token = jwt.sign(payload, secretKey, {
        expiresIn: "1h", // Token expires in 1 hour
    });
    return token;
}
