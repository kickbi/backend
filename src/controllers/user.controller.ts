import { FastifyReply, FastifyRequest } from "fastify";
import { IUserFastifyRequest } from "../interface/fastify.interface";
import * as UserService from "../service/user/user.service";
import * as RESPONSE_MESSAGES from "../messages/response.messages";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response";
import { RESPONSE_STATUS_CODES } from "../constants/response.constants";
import { getS3FileUrl } from "../helpers/s3Helper";

/*
 * @desc    Get details of the authenticated user
 * @route   GET /api/v1/user/me
 * @access  Private
 */
export const getUserDetails = async (req: IUserFastifyRequest, res: FastifyReply) => {
    try {
        const userDetails = req.User;

        if (!userDetails) {
            throw new Error(RESPONSE_MESSAGES.USER_NOT_FOUND);
        }

        const user = await UserService.fetchUserById(userDetails._id);

        if (!user) {
            throw new Error(RESPONSE_MESSAGES.USER_NOT_FOUND)
        }

        if(user.ProfilePicture) {
            user.ProfilePicture = await getS3FileUrl(user.ProfilePicture);
        }

        return sendSuccessResponse(res, RESPONSE_STATUS_CODES.OK, { User: user }, RESPONSE_MESSAGES.USER_DETAILS_FETCHED_SUCCESSFULLY);
    } catch (error) {
        return sendErrorResponse(res, error, RESPONSE_STATUS_CODES.FORBIDDEN);
    }
};