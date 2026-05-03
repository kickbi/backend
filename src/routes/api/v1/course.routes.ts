import { FastifyPluginAsync } from "fastify";
import * as CourseController from "../../../controllers/course.controller";

const CourseRoutes: FastifyPluginAsync = async (app) => {
    /* 
        * @desc    Get list of courses with pagination and search
        * @route   GET /api/v1/course/
        * @access  Public
    */
    app.get("/", CourseController.getCourseList);

    /*
        * @desc    Get course details by slug
        * @route   GET /api/v1/course/:slug
        * @access  Public
    */
    app.get("/:slug", CourseController.getCourseDetails);
};

export default CourseRoutes;
