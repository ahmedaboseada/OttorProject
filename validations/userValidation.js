import joi from 'joi';

export const createUserValidation = joi.object({
    body: joi.object({
        email: joi.string().email().required(),
        password: joi.string().required(),
    })
});

export const loginValidation = joi.object({
    body: joi.object({
        email: joi.string().email().required(),
        password: joi.string().required(),
    })
});
