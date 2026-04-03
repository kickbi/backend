import awsLambdaFastify from "@fastify/aws-lambda";
import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2, Context } from "aws-lambda";
import { buildApp } from "./app";

const proxy = buildApp().then((app) => awsLambdaFastify(app));

export const handler = async (
    event: APIGatewayProxyEventV2,
    context: Context,
): Promise<APIGatewayProxyStructuredResultV2> => {
    return (await proxy)(event, context) as APIGatewayProxyStructuredResultV2;
};
