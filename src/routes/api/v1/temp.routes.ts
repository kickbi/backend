import { FastifyPluginAsync } from "fastify";
import * as TempController from "../../../controllers/temp.controller";

const TempRoutes: FastifyPluginAsync = async (app) => {
    /*
     * @desc    Generate the Schrodinger Equation course seed data
     * @route   POST /api/v1/temp/courses/schrodinger-equation
     * @access  Private
     */
    app.post("/courses/schrodinger-equation", TempController.postGenerateSchrodingerEquationCourse);
};

export default TempRoutes;
