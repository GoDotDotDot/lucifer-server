import * as Joi from '@mete-work/joi';

export const destroyRule = {
  params: {
    id: Joi.string().required(),
  },
};

export const list = {
  query: {
    page: Joi.number()
      .integer()
      .min(1)
      .default(1),
    pageSize: Joi.number()
      .integer()
      .min(10)
      .max(100)
      .default(10),
    account: Joi.string().trim(),
    group: Joi.string().trim(),
    name: Joi.string().trim(),
    mobile: Joi.string().trim(),
    email: Joi.string().trim(),
  },
};

export const createRule = {
  body: {
    account: Joi.string()
      .trim()
      .required(),
    name: Joi.string()
      .trim()
      .required(),
    mobile: Joi.string()
      .trim()
      .allow(''),
    email: Joi.string()
      .email()
      .allow(''),
    password: Joi.string()
      .trim()
      .required(),
  },
};

export const updateRule = {
  params: {
    id: Joi.string()
      .trim()
      .required(),
  },
  body: {
    account: Joi.string()
      .trim()
      .required(),
    name: Joi.string()
      .trim()
      .required(),
    mobile: Joi.string()
      .trim()
      .allow(''),
    email: Joi.string()
      .email()
      .allow(''),
  },
};

export const resetPasswordRule = {
  params: {
    id: Joi.string()
      .trim()
      .required(),
  },
};
