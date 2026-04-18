import { FastifyPluginAsync } from "fastify";
import * as AuthController from "../../../controllers/auth.controller";

const AuthRoutes: FastifyPluginAsync = async (app) => {
    app.post("/signup", AuthController.postSignUpWithEmail);
};

export default AuthRoutes;
