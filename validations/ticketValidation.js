import joi from 'joi';
import { servicesEnum, statusEnum } from '../models/ticketModel.js';

const uaePhoneRegex = /^(?:(?:\+|00)?971)?(?:2|3|4|6|7|9|50|51|52|54|55|56|58)\d{7}$/;

export const createTicketValidation = joi.object({
    body: joi.object({
        fullname: joi.string().required(),
        companyname: joi.string().required(),
        email: joi.string().email().required(),
        phonenumber: joi.string().required().pattern(uaePhoneRegex),
        message: joi.string().required(),
        service: joi.string().required().valid(...Object.values(servicesEnum))
    })
});

export const updateTicketValidation = joi.object({
    body: joi.object({
        status: joi.string().required().valid(...Object.values(statusEnum)).invalid(statusEnum.Pending)
    }),
    params: joi.object({
        id: joi.string().required().length(24).hex()
    })
});

export const getTicketByIdValidation = joi.object({
    params: joi.object({
        id: joi.string().required().length(24).hex()
    })
});

export const getAllTicketsValidation = joi.object({
    query: joi.object({
        page: joi.number().default(1),
        limit: joi.number().default(5),
        service: joi.string().valid(...Object.values(servicesEnum)),
        status: joi.string().valid(...Object.values(statusEnum))
    })
});

export const deleteTicketValidation = joi.object({
    params: joi.object({
        id: joi.string().required().length(24).hex()
    })
});
