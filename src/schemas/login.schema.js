import Joi from "joi";

export const loginSchema = Joi.object({

    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().max(16).required()
});