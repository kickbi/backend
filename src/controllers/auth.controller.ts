import { FastifyReply, FastifyRequest } from "fastify";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response";
import { RESPONSE_STATUS_CODES } from "../constants/response.constants";
import { IEmailLoginRequest } from "../interface/auth.interface";
import * as UserAuthService from "../service/user/userAuth.service";
import { USER_AUTH_PROVIDERS } from "../constants/user.constants";
import * as RESPONSE_MESSAGE from "../messages/response.messages";
import { IUser, IUserAuth } from "../interface/user.interface";
import * as UserService from "../service/user/user.service";
import { generatePasswordHash } from "../helpers/cryptoHelper";

export const postSignUpWithEmail = async (req: FastifyRequest, res: FastifyReply) => {
    let errorResponseCode = RESPONSE_STATUS_CODES.INTERNAL_SERVER_ERROR;
    try {
        const body = req.body as IEmailLoginRequest;
        
        const isUserAuthExists = await UserAuthService.fetchUserAuthByEmail(
            body.email,
            USER_AUTH_PROVIDERS.LOCAL
        );

        if (isUserAuthExists) {
            errorResponseCode = RESPONSE_STATUS_CODES.BAD_REQUEST;
            throw new Error(RESPONSE_MESSAGE.ACCOUNT_ALREADY_EXISTS);
        }

        const userDetails: IUser = {
            FirstName: body.firstName,
            LastName: body.lastName,
            DateOfBirth: body.dateOfBirth,
            FullName: `${body.firstName}${body.lastName ? ` ${body.lastName}` : ""}`,
            Gender: body.gender,
            Email: body.email,
            IsEmailVerified: false,
        };

        const password = generatePasswordHash(body.password);

        const user = await UserService.addUser(userDetails);

        const userAuthDetails: IUserAuth = {
            AuthProvider: USER_AUTH_PROVIDERS.LOCAL,
            Email: body.email,
            UserId: user._id,
            PasswordHash: password.hash,
            PasswordSalt: password.salt,
        };

        const userAuth = await UserAuthService.addUserAuth(userAuthDetails);
        const responseData = {
            User: {
                Id: user._id,
                FirstName: user.FirstName,
                LastName: user.LastName,
                FullName: user.FullName,
                DateOfBirth: user.DateOfBirth,
            },
        };

        return sendSuccessResponse(
            RESPONSE_STATUS_CODES.CREATED,
            responseData,
            RESPONSE_MESSAGE.USER_SUCCESSFULLY_SIGNED_UP
        );

    }catch(error) {
        return sendErrorResponse(error, errorResponseCode);
    }
};