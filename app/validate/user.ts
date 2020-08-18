import * as Joi from '@mete-work/joi';
import { PASSWORD_REGEX } from '../common/constants';

export const passwordUpdate = {
  body: {
    oldPassword: Joi.string()
      .trim()
      .required()
      .description('旧密码'),
    password: Joi.string()
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
      .description('业务码'),
    token: Joi.string()
      .length(32)
      .description('token'),
  },
};

export const passwordUpdateVerify = {
  body: {
    verifyCode: Joi.string()
      .trim()
      .required()
      .description('验证码'),
  },
};

export const update = {
  body: {
    name: Joi.string()
      .trim()
      .required()
      .description('昵称'),
    description: Joi.string()
      .trim()
      .description('个人简介'),
  },
};
