import * as Joi from '@mete-work/joi';

export const list = {
  query: {
    page: Joi.number(),
    pageSize: Joi.number(),
    userName: Joi.string().max(20),
    date: Joi.array().items(Joi.string().max(100)),
    operationType: Joi.string().max(20),
    operationContent: Joi.string().max(100),
  },
};
