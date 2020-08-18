import * as Joi from '@mete-work/joi';

export const paginateRule = {
  page: Joi.number().min(0),
  pageSize: Joi.number().min(0),
  all: Joi.boolean(),
};

export const objectIdRule = Joi.string().length(24);
