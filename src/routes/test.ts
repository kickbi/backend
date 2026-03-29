import { FastifyPluginAsync } from "fastify";

const testRoutes: FastifyPluginAsync = async (app) => {
    app.get("/test", async (request, response) => {
        return { message: "GET /test", dbuser: process.env.DB_USER };
    });

    app.post("/test", async (request) => {
        return { message: "POST /test", body: request.body };
    });
};

export default testRoutes;
