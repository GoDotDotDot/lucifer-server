import * as Joi from '@mete-work/joi';
import { paginateRule, objectIdRule } from '@validate/common';

export const indexRule = {
  query: {
    name: Joi.string().trim(),
    ...paginateRule,
  },
};

export const createRule = {
  body: {
    name: Joi.string()
      .trim()
      .required(),
    describe: Joi.string()
      .trim()
      .required(),
  },
};

export const destroyRule = {
  params: {
    id: objectIdRule,
  },
};

export const editRule = {
  params: {
    id: objectIdRule,
  },
};

export const updateRule = {
  params: {
    id: objectIdRule,
  },
  body: {
    name: Joi.string(),
    describe: Joi.string(),
  },
};

export const setModuleRule = {
  params: {
    id: objectIdRule,
  },
  body: {
    idList: Joi.array()
      .items(Joi.string())
      .required(),
  },
};

export const getModuleRule = {
  params: {
    id: objectIdRule,
    parentId: Joi.string(),
  },
};

export const setUserRule = {
  params: {
    id: objectIdRule,
  },
  body: {
    idList: Joi.array()
      .items(Joi.string())
      .required(),
  },
};

export const getUserRule = {
  params: {
    id: objectIdRule,
  },
};
