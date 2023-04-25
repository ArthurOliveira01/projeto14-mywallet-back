import Joi from "joi";

export const postSchema = Joi.object({
    text: Joi.string().min(3).max(13).required(),
    value: Joi.number().min(0.1).required()
});
