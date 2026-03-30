import { FastifyPluginAsync } from "fastify";
import User from "../models/users/user.model";

const testRoutes: FastifyPluginAsync = async (app) => {
    app.get("/test", async (request, response) => {
        const users = await User.find();
        console.log("Users from DB:", users);
        return { message: "GET /test", dbuser: process.env.DB_USER, users };
    });

    app.post("/test", async (request) => {
        return { message: "POST /test", body: request.body };
    });
};

export default testRoutes;
