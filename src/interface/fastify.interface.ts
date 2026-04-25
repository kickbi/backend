import { FastifyRequest } from "fastify";
import { IUserSession } from "./user.interface";

export interface IUserFastifyRequest extends FastifyRequest {
    User?: IUserSession["User"];
}