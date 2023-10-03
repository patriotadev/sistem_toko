import Joi from 'joi';
import {RegisterInterface, LoginInterface} from '../interfaces/auth-interface';

export const RegisterValidation = (payload: RegisterInterface) => {
    const schema = Joi.object({
        name: Joi.string().max(255).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(255).required(),
        tokoId: Joi.string().max(255).required(),
        roleId: Joi.string().max(255).required()
    });

    return schema.validate(payload);
};

export const LoginValidation = (payload: LoginInterface) => {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
    })
    return schema.validate(payload);
}