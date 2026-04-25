import { FastifyReply, FastifyRequest } from "fastify";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response";
import { RESPONSE_STATUS_CODES } from "../constants/response.constants";
import { IEmailLoginRequest, IEmailSignupRequest, IGoogleOAuthLoginCallbackRequest } from "../interface/auth.interface";
import * as UserAuthService from "../service/user/userAuth.service";
import { USER_AUTH_PROVIDERS } from "../constants/user.constants";
import * as RESPONSE_MESSAGE from "../messages/response.messages";
import { IUser, IUserAuth, IUserSession } from "../interface/user.interface";
import * as UserService from "../service/user/user.service";
import { generatePasswordHash, verifyPassword } from "../helpers/cryptoHelper";
import { generateJWT } from "../helpers/jwtHelper";
import { getGoogleUserInfo, verifyGoogleOAuthToken } from "../helpers/googleOAuthHelper";
import { uploadFileToS3UsingFileUrl } from "../helpers/s3Helper";

/*
    @desc    Sign up a user with email and password
    @route   POST /api/v1/auth/signup
    @access  Public
*/
export const postSignUpWithEmail = async (req: FastifyRequest, res: FastifyReply) => {
    let errorResponseCode = RESPONSE_STATUS_CODES.INTERNAL_SERVER_ERROR;
    try {
        const body = req.body as IEmailSignupRequest;
        
        const isUserAuthExists = await UserAuthService.fetchUserAuthByEmail(body.email);

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
            res,
            RESPONSE_STATUS_CODES.CREATED,
            responseData,
            RESPONSE_MESSAGE.USER_SUCCESSFULLY_SIGNED_UP
        );

    }catch(error) {
        return sendErrorResponse(res, error, errorResponseCode);
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
        const userAuth = await UserAuthService.fetchUserAuthByEmailAndAuthProvider(
            email,
            USER_AUTH_PROVIDERS.LOCAL
        );

        if (!userAuth || !userAuth.PasswordHash || !userAuth.PasswordSalt) {
            throw new Error(RESPONSE_MESSAGE.INVALID_EMAIL_OR_PASSWORD);
        }

        const isPasswordValid = verifyPassword(password, userAuth.PasswordSalt, userAuth.PasswordHash);

        if (!isPasswordValid) {
            throw new Error(RESPONSE_MESSAGE.INVALID_EMAIL_OR_PASSWORD);
        }

        const user = await UserService.fetchUserById(userAuth.UserId);

        if (!user) {
            throw new Error(RESPONSE_MESSAGE.INVALID_EMAIL_OR_PASSWORD);
        }

        // generate JWT token or session here and send in response
        const payload: IUserSession = {
            User: {
                _id: user._id,
                FirstName: user.FirstName,
                LastName: user.LastName || "",
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
            res,
            RESPONSE_STATUS_CODES.OK,
            responseData,
            RESPONSE_MESSAGE.USER_SUCCESSFULLY_LOGGED_IN
        );
    }
    catch(error) {
        return sendErrorResponse(res, error, RESPONSE_STATUS_CODES.FORBIDDEN);
    }
}



/*
    @desc    Handle Google OAuth callback
    @route   GET /web/auth/googleoauthcallback
    @access  Public
*/
export const getLoginWithGoogleOAuth = async (req: FastifyRequest, res: FastifyReply) => {
    try {
        const googleOAuthCallbackRequest = req.query as IGoogleOAuthLoginCallbackRequest;
        const { iss, code, scope, authuser, prompt } = googleOAuthCallbackRequest;

        const verifyTokenResponse = await verifyGoogleOAuthToken(code);

        const googleUserInfo = await getGoogleUserInfo(verifyTokenResponse.access_token);

        const isUserAuthExists = await UserAuthService.fetchUserAuthByEmail(googleUserInfo.email);

        let userId = isUserAuthExists ? isUserAuthExists.UserId : null;

        if (!isUserAuthExists) {
            // If user doesn't exist, create a new user and user auth entry


            const userDetails: IUser = {
                FirstName: googleUserInfo.given_name,
                LastName: googleUserInfo.family_name,
                FullName: googleUserInfo.name,
                Email: googleUserInfo.email,
                IsEmailVerified: googleUserInfo.verified_email,
            };

            const user = await UserService.addUser(userDetails);

            // If Google profile has a picture, upload it to S3 and save the key in user's ProfilePicture field
            if(googleUserInfo.picture) {
                const pictureRes = await uploadFileToS3UsingFileUrl(
                    googleUserInfo.picture,
                    String(user._id),
                    "profile-picture",
                    `google-oauth-${Date.now()}.jpg`,
                    "image/jpeg"
                );
                await UserService.updateUser(user._id, { ProfilePicture: pictureRes.key });

            }


            const userAuthDetails: IUserAuth = {
                AuthProvider: USER_AUTH_PROVIDERS.GOOGLE,
                Email: googleUserInfo.email,
                UserId: user._id,
            };

            await UserAuthService.addUserAuth(userAuthDetails);
            userId = user._id;
        }

        // generate JWT token or session here and send in response
        const user = await UserService.fetchUserById(userId!);

        if (!user) {
            throw new Error(RESPONSE_MESSAGE.USER_NOT_FOUND);
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

        res.redirect(`${process.env.FRONTEND_URL}/oauth/google?token=${jwtToken}`);
    }catch(error) {
        return sendErrorResponse(res, error, RESPONSE_STATUS_CODES.FORBIDDEN);
    }
}


