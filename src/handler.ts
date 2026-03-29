import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import type { FastifyInstance, InjectOptions } from "fastify";
import { buildApp } from "./app";
import { HOP_BY_HOP_HEADERS, RESPONSE_STATUS_CODES } from "./utils/constants";
import { sendError } from "./utils/response";
import { APPLICATION_INITIALIZATION_ERROR } from "./utils/responseMessages";

let fastify: FastifyInstance | null = null;
let initError: string | null = null;

const appReady = (async () => {
    try {
        fastify = await buildApp();
        await fastify.ready();
    } catch (err) {
        initError = err instanceof Error ? `${err.message}\n${err.stack}` : String(err);
    }
})();

const ensureInitialized = async (): Promise<boolean> => {
    await appReady;
    return !initError && fastify !== null;
};

export const handler = async (
    event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyStructuredResultV2> => {
    if (!(await ensureInitialized()) || !fastify) {
        return sendError(
            APPLICATION_INITIALIZATION_ERROR,
            initError,
            RESPONSE_STATUS_CODES.INTERNAL_SERVER_ERROR,
        );
    }

    const app: FastifyInstance = fastify;

    const url = event.rawPath + (event.rawQueryString ? `?${event.rawQueryString}` : "");
    const headers: Record<string, string> = {};
    for (const [k, v] of Object.entries(event.headers ?? {})) {
        if (v !== undefined) headers[k] = v;
    }
    if (event.cookies?.length) headers.cookie = event.cookies.join("; ");

    const payload =
        event.isBase64Encoded && event.body
            ? Buffer.from(event.body, "base64")
            : (event.body ?? undefined);

    const res = await app.inject({
        method: event.requestContext.http.method as InjectOptions["method"],
        url,
        headers,
        payload,
    });

    const resHeaders: Record<string, string> = {};
    for (const [k, v] of Object.entries(res.headers)) {
        if (!HOP_BY_HOP_HEADERS.has(k.toLowerCase())) {
            resHeaders[k] = Array.isArray(v) ? v.join(", ") : String(v);
        }
    }

    return { statusCode: res.statusCode, headers: resHeaders, body: res.body };
};
