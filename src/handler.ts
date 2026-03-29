import type { FastifyInstance } from "fastify";
import { buildApp } from "./app";

let fastify: FastifyInstance | null = null;
let initError: string | null = null;

const initPromise = (async () => {
  try {
    fastify = await buildApp();
    await fastify.ready();
  } catch (err) {
    initError = err instanceof Error ? `${err.message}\n${err.stack}` : String(err);
  }
})();

const HOP_BY_HOP = new Set(["connection", "keep-alive", "transfer-encoding", "upgrade", "te", "trailers"]);

export const handler = async (event: any): Promise<any> => {
  await initPromise;

  if (initError || !fastify) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Initialization failed", detail: initError }),
    };
  }

  const url = event.rawPath + (event.rawQueryString ? `?${event.rawQueryString}` : "");
  const headers: Record<string, string> = {};
  for (const [k, v] of Object.entries(event.headers ?? {})) {
    if (v !== undefined) headers[k] = v as string;
  }
  if (event.cookies?.length) headers.cookie = event.cookies.join("; ");

  const payload = event.isBase64Encoded && event.body
    ? Buffer.from(event.body, "base64")
    : (event.body ?? undefined);

  const res = await fastify.inject({
    method: event.requestContext.http.method,
    url,
    headers,
    payload,
  });

  const resHeaders: Record<string, string> = {};
  for (const [k, v] of Object.entries(res.headers)) {
    if (!HOP_BY_HOP.has(k.toLowerCase())) {
      resHeaders[k] = Array.isArray(v) ? v.join(", ") : String(v);
    }
  }

  return { statusCode: res.statusCode, headers: resHeaders, body: res.body };
};
