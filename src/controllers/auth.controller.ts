import { FastifyReply, FastifyRequest } from "fastify";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response";
import { RESPONSE_STATUS_CODES } from "../constants/response.constants";
import { IEmailLoginRequest, IEmailSignupRequest } from "../interface/auth.interface";
import * as UserAuthService from "../service/user/userAuth.service";
import { USER_AUTH_PROVIDERS } from "../constants/user.constants";
import * as RESPONSE_MESSAGE from "../messages/response.messages";
import { IUser, IUserAuth } from "../interface/user.interface";
import * as UserService from "../service/user/user.service";
import { generatePasswordHash, verifyPassword } from "../helpers/cryptoHelper";
import { generateJWT } from "../helpers/jwtHelper";

/*
    @desc    Sign up a user with email and password
    @route   POST /api/v1/auth/signup
    @access  Public
*/
export const postSignUpWithEmail = async (req: FastifyRequest, res: FastifyReply) => {
    let errorResponseCode = RESPONSE_STATUS_CODES.INTERNAL_SERVER_ERROR;
    try {
        const body = req.body as IEmailSignupRequest;
        
        const isUserAuthExists = await UserAuthService.fetchUserAuthByEmailAndAuthProvider(
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


/*
    @desc    Login a user with email and password
    @route   POST /api/v1/auth/login
    @access  Public
*/
export const postLoginWithEmail = async (req: FastifyRequest, res: FastifyReply) => {
    try {
        const { email, password } = req.body as IEmailLoginRequest;
        const userAuth = await UserAuthService.fetchUserAuthByEmail(
            email,
        );

        if (!userAuth || !userAuth.PasswordHash || !userAuth.PasswordSalt) {
            throw new Error(RESPONSE_MESSAGE.INVALID_EMAIL_OR_PASSWORD);
        }

        const isPasswordValid = verifyPassword(password, userAuth.PasswordHash, userAuth.PasswordSalt);

        if (!isPasswordValid) {
            throw new Error(RESPONSE_MESSAGE.INVALID_EMAIL_OR_PASSWORD);
        }

        const user = await UserService.fetchUserById(userAuth.UserId);

        if (!user) {
            throw new Error(RESPONSE_MESSAGE.INVALID_EMAIL_OR_PASSWORD);
        }

        // generate JWT token or session here and send in response
        const payload = {
            User: {
                _id: user._id,
                FirstName: user.FirstName,
                LastName: user.LastName,
                FullName: user.FullName,
                Email: user.Email,
            }
        };

        const jwtToken = generateJWT(payload);
        const responseData = {
            Token: jwtToken,
            User: payload.User,
        };

        return sendSuccessResponse(
            RESPONSE_STATUS_CODES.OK,
            responseData,
            RESPONSE_MESSAGE.USER_SUCCESSFULLY_LOGGED_IN
        );
    }
    catch(error) {
        return sendErrorResponse(error, RESPONSE_STATUS_CODES.FORBIDDEN);
    }
}
