import Joi from 'joi';

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

export default {
  signUp: {
    create: Joi.object().keys({
      fullName: Joi.string().min(2).required(),
      email: Joi.string().regex(EMAIL_REGEX).email().required(),
      password: Joi.string().regex(PASSWORD_REGEX).min(8).max(72).required(),
    }),
  },
  auth: {
    login: Joi.object().keys({
      username: Joi.string().email().required(),
      password: Joi.string().min(8).max(72).required(),
    }),
    logout: Joi.object().keys({
      refreshToken: Joi.string().required(),
    }),
    refreshToken: Joi.object().keys({
      refreshToken: Joi.string().required(),
    }),
  },
};
