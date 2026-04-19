import { FastifyReply } from "fastify";

export function sendSuccessResponse(
    response: FastifyReply,
    statusCode: number,
    body: unknown,
    message: string,
) {
    return response.status(statusCode).send({ data: body, message });
}

export function sendErrorResponse(
    response: FastifyReply,
    error: unknown,
    statusCode = 500,
) {
    if (error instanceof Error) {
        return response.status(statusCode).send({ error: error.message });
    }
    return response.status(statusCode).send({ error: "An unknown error occurred" });
}


export function sendValidationErrorResponse(
    response: FastifyReply,
    error: unknown,
    statusCode = 400,
) {
    if (error instanceof Error) {
        return response.status(statusCode).send({ error: error.message });
    }
    if (typeof error === "string") {
        return response.status(statusCode).send({ error });
    }
    if (Array.isArray(error)) {
        return response.status(statusCode).send({ error: error });
    }
    return response.status(statusCode).send({ error: "An unknown validation error occurred" });
}

