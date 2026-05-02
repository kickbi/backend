import { FastifyReply, FastifyRequest } from "fastify";
import { RESPONSE_STATUS_CODES } from "../constants/response.constants";
import * as RESPONSE_MESSAGES from "../messages/response.messages";
import { generateSchrodingerEquationCourse } from "../service/course/schrodingerCourse.service";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response";

/*
 * @desc    Generate the Schrodinger equation course seed data
 * @route   POST /api/v1/temp/courses/schrodinger-equation
 * @access  Private
 */
export const postGenerateSchrodingerEquationCourse = async (_req: FastifyRequest, res: FastifyReply) => {
    try {
        const result = await generateSchrodingerEquationCourse();

        return sendSuccessResponse(
            res,
            RESPONSE_STATUS_CODES.CREATED,
            result,
            RESPONSE_MESSAGES.SCHRODINGER_COURSE_GENERATED_SUCCESSFULLY,
        );
    } catch (error) {
        return sendErrorResponse(res, error, RESPONSE_STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
};
