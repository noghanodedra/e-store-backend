import Joi from 'joi';

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

export default {
  signUp: {
    create: Joi.object().keys({
      fullName: Joi.string().min(2).required().label('Full Name'),
      email: Joi.string()
        .regex(EMAIL_REGEX)
        .email()
        .required()
        .label('Email')
        .messages({
          'string.pattern.base': `"Email" must be a valid email`,
        }),
      password: Joi.string()
        .regex(PASSWORD_REGEX)
        .min(8)
        .max(72)
        .required()
        .label('Password')
        .messages({
          'string.pattern.base': `"Password" must be a valid password. It should contain at least one uppercase character, one lowercase character and one digit.`,
        }),
    }),
  },
  auth: {
    login: Joi.object().keys({
      username: Joi.string().email().required().label('User Name'),
      password: Joi.string().min(8).max(72).required().label('Password'),
    }),
  },
};
