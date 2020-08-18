import * as Joi from '@mete-work/joi';

export const downloadRule = {
  params: {
    name: Joi.string()
      .trim()
      .required()
      .description('物料名称'),
    fileName: Joi.string()
      .trim()
      .required()
      .description('物料文件名称'),
  },
};

export const listRule = {
  query: {
    type: Joi.string()
      .trim()
      .description('物料类型'),
    name: Joi.string()
      .trim()
      .description('物料名称'),
    tags: Joi.string().description('物料标签'),
  },
};

export const infoRule = {
  query: {
    name: Joi.string()
      .trim()
      .description('物料名称'),
    version: Joi.string()
      .trim()
      .allow('')
      .description('物料版本'),
    type: Joi.string()
      .description('物料类型')
      .allow(''),
    tags: Joi.array()
      .items(Joi.string())
      .description('物料标签'),
  },
};
