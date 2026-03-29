import Fastify from "fastify";
import { loadConfig } from "./config/secrets";
import testRoutes from "./routes/test";
import test1Routes from "./routes/test1";

export async function buildApp() {
  await loadConfig();

  const app = Fastify({ logger: true });

  app.register(testRoutes);
  app.register(test1Routes);

  return app;
}
