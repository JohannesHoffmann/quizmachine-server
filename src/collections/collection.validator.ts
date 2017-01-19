import * as Joi from "joi";

export const createCollectionModel = Joi.object().keys({
    name: Joi.string().required(),
    number_answers: Joi.number().required(),
    number_correct_answers: Joi.number().required(),
    question_display_mode: Joi.string().required(),
    explanation: Joi.string().required(),
    image: Joi.object(),
});

export const updateCollectionModel = Joi.object().keys({
    name: Joi.string(),
    number_answers: Joi.number(),
    number_correct_answers: Joi.number(),
    question_display_mode: Joi.string(),
    explanation: Joi.string(),
    image: Joi.object(),
});