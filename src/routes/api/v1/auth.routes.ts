import { FastifyPluginAsync } from "fastify";
import * as AuthController from "../../../controllers/auth.controller";
import { signUpUserValidator } from "../../../validators/auth.validator";

const AuthRoutes: FastifyPluginAsync = async (app) => {
    /*
     * @desc    Sign up a new user with email and password
     * @route   POST /api/v1/auth/signup
     * @access  Public
     */
    app.post(
        "/signup",
        { preValidation: [signUpUserValidator] },
        AuthController.postSignUpWithEmail
    );

    /*
     * @desc    Log in a user with email and password
     * @route   POST /api/v1/auth/login
     * @access  Public
     */

    app.post("/login", AuthController.postLoginWithEmail);
};

export default AuthRoutes;
