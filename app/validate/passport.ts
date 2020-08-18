import * as Joi from '@mete-work/joi';
import { PASSWORD_REGEX, LITE_PHONE_OR_EMAIL_REGEX } from '../common/constants';

export const loginRule = {
  body: {
    type: Joi.string()
      .trim()
      .required(),
    username: Joi.string()
      .trim()
      .required(),
    password: Joi.string()
      .trim()
      .required(),
    verifyCode: Joi.string().max(10),
    challenge: Joi.string(),
    validate: Joi.string(),
    seccode: Joi.string(),
  },
};

export const loginVerify = {
  body: {
    id: Joi.string()
      .trim()
      .required(),
    verifyCode: Joi.string()
      .trim()
      .required(),
  },
};

export const register = {
  body: {
    username: Joi.string()
      .trim()
      .required(),
    password: Joi.string()
      .trim()
      .required(),
  },
};

export const twoFALogin = {
  body: {
    bizCode: Joi.string()
      .trim()
      .max(20)
      .required(),
    token: Joi.string()
      .trim()
      .length(32)
      .required(),
  },
};

export const passwordResetMethod = {
  query: {
    account: Joi.string()
      .trim()
      .max(20)
      .regex(LITE_PHONE_OR_EMAIL_REGEX)
      .required(),
  },
};

export const resetPassword = {
  body: {
    password: Joi.string()
      .trim()
      .regex(PASSWORD_REGEX)
      .required()
      .error(
        new Error('密码需要由8-16个字符（必须包含字母、数字、特殊字符）组成'),
      )
      .description('密码'),
    passwordConfirm: Joi.string()
      .trim()
      .regex(PASSWORD_REGEX)
      .required()
      .error(
        new Error('密码需要由8-16个字符（必须包含字母、数字、特殊字符）组成'),
      )
      .description('密码'),
    bizCode: Joi.string()
      .trim()
      .max(20)
      .required(),
    token: Joi.string()
      .trim()
      .length(32)
      .required(),
  },
};
