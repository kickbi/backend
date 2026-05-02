import { FastifyReply } from "fastify";
import { IUserFastifyRequest } from "../interface/fastify.interface";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response";
import { RESPONSE_STATUS_CODES } from "../constants/response.constants";
import * as RESPONSE_MESSAGES from "../messages/response.messages";
import { listCourseChapters, listCourses } from "../service/course/course.service";

export const getCourseList = async function (req: IUserFastifyRequest, res: FastifyReply) {
    try {
        const courses = await listCourses
        
        return sendSuccessResponse(res, RESPONSE_STATUS_CODES.OK, {  }, RESPONSE_MESSAGES.USER_DETAILS_FETCHED_SUCCESSFULLY);
    } catch (error) {
        return sendErrorResponse(res, error, RESPONSE_STATUS_CODES.FORBIDDEN);
    }
}