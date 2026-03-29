export const HOP_BY_HOP_HEADERS = new Set<string>([
    "connection",
    "keep-alive",
    "transfer-encoding",
    "upgrade",
    "te",
    "trailers",
]);


export const RESPONSE_STATUS_CODES = {
    OK: 200,
    BAD_REQUEST: 400,
    INTERNAL_SERVER_ERROR: 500,
}