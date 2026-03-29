import awsLambdaFastify from "@fastify/aws-lambda";
import type { APIGatewayProxyEventV2, Context } from "aws-lambda";
import { buildApp } from "./app";

let proxy: ReturnType<typeof awsLambdaFastify> | null = null;

async function getProxy() {
  if (!proxy) {
    const app = await buildApp();
    proxy = awsLambdaFastify(app);
  }
  return proxy;
}

export const handler = (
  event: APIGatewayProxyEventV2,
  context: Context,
  callback: (err?: Error, result?: unknown) => void
) => {
  getProxy().then((proxyFn) => proxyFn(event, context, callback));
};
