import { FastifyInstance } from "fastify";
import AuthRoutes from "./routes/api/v1/auth.routes";

export const setupRoutes = (app: FastifyInstance) => {
    app.register(AuthRoutes, { prefix: "/api/v1/auth" });
};