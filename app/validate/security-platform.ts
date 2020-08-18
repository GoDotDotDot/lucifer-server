import * as Joi from '@mete-work/joi';

export const emailSendRule = {
  body: {
    bizCode: Joi.string()
      .trim()
      .max(50)
      .required()
      .description('业务编码'),
    email: Joi.string()
      .email()
      .description('邮箱号码'),
  },
};

export const verifyRule = {
  body: {
    bizCode: Joi.string()
      .trim()
      .max(50)
      .required()
      .description('业务编码'),
    email: Joi.string()
      .trim()
      .max(6)
      .description('邮箱验证码'),
    ga: Joi.string()
      .trim()
      .max(6)
      .description('谷歌验证码'),
  },
};

export const authRule = {
  body: {
    bizCode: Joi.string()
      .trim()
      .max(50)
      .required()
      .description('业务编码'),
    token: Joi.string()
      .trim()
      .length(32)
      .required()
      .description('token'),
  },
};

export const generateGARule = {
  query: {
    bizCode: Joi.string()
      .trim()
      .max(50)
      .required()
      .description('业务编码'),
  },
};

export const bindGARule = {
  body: {
    ga: Joi.string()
      .trim()
      .length(6)
      .required()
      .description('谷歌验证码'),
  },
};

export const enableGAAuthRule = {
  body: {
    bizCode: Joi.string()
      .trim()
      .max(50)
      .required()
      .description('业务编码'),
    token: Joi.string()
      .trim()
      .length(32)
      .required()
      .description('token'),
  },
};

export const disableGAAuthRule = {
  body: {
    bizCode: Joi.string()
      .trim()
      .max(50)
      .required()
      .description('业务编码'),
    token: Joi.string()
      .trim()
      .length(32)
      .required()
      .description('token'),
  },
};

export const editBindGARule = {
  body: {
    tokens: Joi.array()
      .items({
        token: Joi.string()
          .length(32)
          .required(),
        bizCode: Joi.string()
          .max(50)
          .required(),
      })
      .length(2)
      .required()
      .description('验证信息'),
  },
};
export const twoFAListRule = {
  query: {
    account: Joi.string()
      .trim()
      .max(50)
      .required()
      .description('用户名'),
  },
};

export const bindEmailRule = {
  body: {
    bizCode: Joi.string()
      .trim()
      .max(50)
      .required()
      .description('业务编码'),
    email: Joi.string()
      .email()
      .required()
      .description('邮箱'),
    code: Joi.string()
      .trim()
      .length(6)
      .required()
      .description('邮箱验证码'),
  },
};

export const editBindEmailRule = {
  body: {
    tokens: Joi.array()
      .items({
        token: Joi.string()
          .length(32)
          .required(),
        bizCode: Joi.string()
          .max(50)
          .required(),
      })
      .length(2)
      .required()
      .description('验证信息'),
    email: Joi.string()
      .trim()
      .max(20)
      .required()
      .description('邮箱号'),
  },
};

export const enableEmailAuthRule = {
  body: {
    bizCode: Joi.string()
      .trim()
      .max(50)
      .required()
      .description('业务编码'),
    token: Joi.string()
      .trim()
      .length(32)
      .required()
      .description('token'),
  },
};

export const disableEmailAuthRule = {
  body: {
    bizCode: Joi.string()
      .trim()
      .max(50)
      .required()
      .description('业务编码'),
    token: Joi.string()
      .trim()
      .length(32)
      .required()
      .description('token'),
  },
};
