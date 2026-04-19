import Fastify from "fastify";
import cors from "@fastify/cors";
import { loadConfig } from "./config/secrets";
import { connectDB } from "./config/db";

// In Lambda, pino's thread-stream can't resolve worker paths → disable logger there
const isLambda = !!process.env.AWS_LAMBDA_FUNCTION_NAME;

export async function buildApp() {
    await loadConfig();
    await connectDB();

    const app = Fastify({
        logger: isLambda ? false : { level: "info" },
    });

    const allowedOrigins = (process.env.CORS_ORIGINS ?? "")
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean);

    await app.register(cors, {
        origin: allowedOrigins.length ? allowedOrigins : false,
        credentials: true,
    });

    const { setupRoutes } = await import("./routesSetup");
    setupRoutes(app);

    return app;
}
