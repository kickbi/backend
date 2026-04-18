import * as Crypto from "node:crypto"

export const generatePasswordHash = (password: string) => {
    const salt = Crypto.randomBytes(16).toString('hex');
    return {
        salt,
        hash: Crypto.createHash("sha256").update(password + salt).digest("hex")
    };
}


export const verifyPassword = (password: string, salt: string, hash: string) => {
    const passwordHash = Crypto.createHash("sha256").update(password + salt).digest("hex");
    return passwordHash === hash;
}

