import { FastifyPluginAsync } from "fastify";

const test1Routes: FastifyPluginAsync = async (app) => {
    app.get("/test1", async () => {
        return { message: "GET /test1" };
    });
};

export default test1Routes;
