import { FastifyInstance } from "fastify";
import AuthRoutes from "./routes/api/v1/auth.routes";
import AuthCallbackRoutes from "./routes/web/authCallback.route";
import { authMiddleware } from "./middlewares/auth.middleware";
import UserRoutes from "./routes/api/v1/user.routes";
import CourseRoutes from "./routes/api/v1/course.routes";

export const setupRoutes = (app: FastifyInstance) => {
    // add auth guard middleware to protect routes that require authentication for all api routes
    app.addHook("preHandler", authMiddleware);
    app.register(AuthRoutes, { prefix: "/api/v1/auth" });
    app.register(UserRoutes, { prefix: "/api/v1/user" });
    app.register(CourseRoutes, { prefix: "/api/v1/course" });


    app.register(AuthCallbackRoutes, { prefix: "/web/auth" });
};
