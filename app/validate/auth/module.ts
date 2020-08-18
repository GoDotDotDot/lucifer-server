import * as Joi from '@mete-work/joi';

export const createRule = {
  body: {
    name: Joi.string()
      .trim()
      .required(),
    url: Joi.string()
      .trim()
      .allow(''),
    uri: Joi.string()
      .trim()
      .allow(''),
    isMenu: Joi.boolean(),
    icon: Joi.string()
      .trim()
      .allow(''),
    describe: Joi.string()
      .trim()
      .allow(''),
    sort: Joi.number().default(0),
    show: Joi.number(),
    parentId: Joi.string()
      .trim()
      .allow(''),
  },
};

export const updateRule = {
  params: {
    id: Joi.string()
      .trim()
      .required(),
  },
  body: createRule.body,
};

export const list = {
  query: {
    name: Joi.string(),
    url: Joi.string(),
    uri: Joi.string(),
    parentId: Joi.string(),
    page: Joi.number(),
    pageSize: Joi.number(),
  },
};

export const destroyRule = {
  params: {
    id: Joi.string()
      .trim()
      .required(),
  },
};
