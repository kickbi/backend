import { FastifyPluginAsync } from "fastify";
import * as UserController from "../../../controllers/user.controller";
import { signUpUserValidator } from "../../../validators/auth.validator";

const UserRoutes: FastifyPluginAsync = async (app) => {
    app.get("/me", UserController.getUserDetails);
};

export default UserRoutes;
