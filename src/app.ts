import Fastify from "fastify";
import { loadConfig } from "./config/secrets";
import { connectDB } from "./db/connection";
import testRoutes from "./routes/test";
import test1Routes from "./routes/test1";

// In Lambda, pino's thread-stream can't resolve worker paths → disable logger there
const isLambda = !!process.env.AWS_LAMBDA_FUNCTION_NAME;

export async function buildApp() {
    await loadConfig();
    await connectDB();

    const app = Fastify({
        logger: isLambda ? false : { level: "info" },
    });

    app.register(testRoutes);
    app.register(test1Routes);

    return app;
}
