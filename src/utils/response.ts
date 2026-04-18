import type { APIGatewayProxyStructuredResultV2 } from "aws-lambda";

const JSON_CONTENT_TYPE = { "content-type": "application/json" };

export function sendSuccessResponse(
    statusCode: number,
    body: unknown,
    message: string,
): APIGatewayProxyStructuredResultV2 {
    return {
        statusCode,
        headers: JSON_CONTENT_TYPE,
        body: JSON.stringify({ data: body, message }),
    };
}

export function sendErrorResponse(
    error: unknown,
    statusCode = 500,
): APIGatewayProxyStructuredResultV2 {
    if (error instanceof Error) {
        return {
            statusCode,
            headers: JSON_CONTENT_TYPE,
            body: JSON.stringify({ error: error.message }),
        };
    }


    return {
        statusCode,
        headers: JSON_CONTENT_TYPE,
        body: JSON.stringify({ error: "An unknown error occurred" }),
    };
}
