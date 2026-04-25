import { FastifyPluginAsync } from "fastify";
import { getLoginWithGoogleOAuth } from "../../controllers/auth.controller";

const AuthCallbackRoutes: FastifyPluginAsync = async (app) => {
    /*
     * @desc    Handle Google OAuth callback
     * @route   GET /web/auth/googleoauthcallback
     * @access  Public
     */
    app.get("/googleoauthcallback", getLoginWithGoogleOAuth);
};

export default AuthCallbackRoutes;
