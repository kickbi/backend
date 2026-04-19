import { FastifyReply, FastifyRequest } from "fastify";
import { sendValidationErrorResponse } from "../utils/response";
import Joi from "joi";
import { USER_GENDER } from "../constants/user.constants";
import { RESPONSE_STATUS_CODES } from "../constants/response.constants";
import { error } from "console";

export const signUpUserValidator = async function (req: FastifyRequest, res: FastifyReply) {
    const SignUpSchema = Joi.object({
        firstName: Joi.string().required().label("First Name"),
        lastName: Joi.string().required().label("Last Name"),
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().min(6).required().label("Password"),
        dateOfBirth: Joi.date().required().label("Date of Birth"),
        gender: Joi.string().valid(...Object.values(USER_GENDER)).required().label("Gender").messages({
            "any.only": `Gender must be one of ${Object.keys(USER_GENDER).join(", ")}`,
        }),
    });

    const { error } = SignUpSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return sendValidationErrorResponse(res, errors, RESPONSE_STATUS_CODES.BAD_REQUEST);
    }
}