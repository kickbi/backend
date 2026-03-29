import type { APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { FastifyReply } from "fastify";

const JSON_CONTENT_TYPE = { "content-type": "application/json" };

export function sendSuccess(response: FastifyReply, statusCode = 200, message: string, body: unknown) {
    response.send({
        statusCode,
        headers: JSON_CONTENT_TYPE,
        body: JSON.stringify({ message, data: body }),
    });
}

export function sendError(
    response: FastifyReply,
    statusCode = 500,
    message: string,
    error: any
) {
    response.status(statusCode).send({
        statusCode,
        headers: JSON_CONTENT_TYPE,
        body: JSON.stringify({ message, error: error instanceof Error ? `${error.message}\n${error.stack}` : String(error) }),
    });
}
