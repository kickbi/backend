import type { APIGatewayProxyStructuredResultV2 } from "aws-lambda";

const JSON_CONTENT_TYPE = { "content-type": "application/json" };

export function sendSuccess(
    statusCode: number,
    body: unknown,
): APIGatewayProxyStructuredResultV2 {
    return {
        statusCode,
        headers: JSON_CONTENT_TYPE,
        body: JSON.stringify(body),
    };
}

export function sendError(
    message: string,
    detail?: string | null,
    statusCode = 500,
): APIGatewayProxyStructuredResultV2 {
    return {
        statusCode,
        headers: JSON_CONTENT_TYPE,
        body: JSON.stringify({ message, ...(detail != null ? { detail } : {}) }),
    };
}
