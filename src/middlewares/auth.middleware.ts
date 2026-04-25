import { FastifyReply, FastifyRequest } from "fastify"
import { sendErrorResponse } from "../utils/response"
import { RESPONSE_STATUS_CODES } from "../constants/response.constants"
import { UNAUTHORIZED } from "../messages/response.messages"
import { verifyJWT } from "../helpers/jwtHelper"

const PUBLIC_ROUTES_REGEX = [
    /^\/api\/auth\//, // Allow all routes under /api/auth/
    /^\/web\/auth\//, // Allow all routes under /web/auth/
]


export const authMiddleware = async (req: FastifyRequest, res: FastifyReply) => {
    // Check if the request path matches any public route
    try {
        const isPublicRoute = PUBLIC_ROUTES_REGEX.some((regex) => regex.test(req.url))

        const authHeader = req.headers.authorization || "";
        const token = authHeader && authHeader.split(" ")[1];

        // If it's a public route and there's no token, allow the request to proceed
        if (isPublicRoute && !token) {
            return;
        }

        if (
            (isPublicRoute && token) || // If it's a public route but there's a token, we can optionally verify it
            (!isPublicRoute && token) // If it's not a public route, we must have a token
        ) {
            const { User } = await verifyJWT(token);
            // You can attach the user information to the request object if needed
            (req as any).User = User;
            return;
        }

        throw new Error(UNAUTHORIZED);

    } catch (error) {
        sendErrorResponse(res, error, RESPONSE_STATUS_CODES.UNAUTHORIZED)
    }
}