import { FastifyReply, FastifyRequest } from "fastify";
import { IUserFastifyRequest } from "../interface/fastify.interface";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response";
import { RESPONSE_STATUS_CODES } from "../constants/response.constants";
import * as RESPONSE_MESSAGES from "../messages/response.messages";
import * as CourseService from "../service/course/course.service";
import { TProjection, ISearchPagination } from "../interface/common.interface";
import { TChapterDocument, TCourseDocument } from "../interface/document.interface";



/*
 * @desc    Get list of courses with pagination and search
 * @route   GET /api/v1/course/
 * @access  Public
 */
export const getCourseList = async function (req: FastifyRequest, res: FastifyReply) {
    try {
        const queryParams = req.query as ISearchPagination;
        
        const courseProjection: TProjection<TCourseDocument> = {
            Thumbnail: 1,
            Title: 1,
            Description: 1,
            DifficultyLevel: 1,
            LanguageSupported: 1,
            ChaptersCount: 1,
            TopicsCount: 1,
            "SEO.Slug": 1
        }
        const courses = await CourseService.listCourses(queryParams, courseProjection);
        
        return sendSuccessResponse(res, RESPONSE_STATUS_CODES.OK, { courses }, RESPONSE_MESSAGES.USER_DETAILS_FETCHED_SUCCESSFULLY);
    } catch (error) {
        return sendErrorResponse(res, error, RESPONSE_STATUS_CODES.FORBIDDEN);
    }
}



/*
    * @desc    Get course details by slug
    * @route   GET /api/v1/course/:slug
    * @access  Public
*/
export const getCourseDetails = async function (req: FastifyRequest, res: FastifyReply) {
    try {
        const {slug} = req.params as { slug: string };

        const courseProjection: TProjection<TCourseDocument> = {
            Thumbnail: 1,
            Title: 1,
            Description: 1,
            DifficultyLevel: 1,
            LanguageSupported: 1,
            ChaptersCount: 1,
            TopicsCount: 1,
            "SEO.Slug": 1,
        };
        const course = await CourseService.getCourseBySlug(slug, courseProjection);

        if (!course) {
            throw new Error(RESPONSE_MESSAGES.COURSE_NOT_FOUND);
        }

        const chapterProjection: TProjection<TChapterDocument> = {
            Title: 1,
            Order: 1,
            Description: 1,
            "SEO.Slug": 1,
        }

        const chapters = await CourseService.listCourseChapters(course._id, chapterProjection);

        return sendSuccessResponse(res, RESPONSE_STATUS_CODES.OK, { course, chapters }, RESPONSE_MESSAGES.COURSE_DETAILS_FETCHED_SUCCESSFULLY);

    } catch (error) {
        return sendErrorResponse(res, error, RESPONSE_STATUS_CODES.FORBIDDEN);
    }
}

