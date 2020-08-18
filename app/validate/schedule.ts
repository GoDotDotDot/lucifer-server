import * as Joi from '@mete-work/joi';

export const queuesRule = {
  query: {
    queueName: Joi.string(),
  },
};

export const jobsRule = {
  query: {
    queueName: Joi.string().required(),
    state: Joi.string(),
  },
};

export const addJobRule = {
  body: {
    name: Joi.string()
      .trim()
      .required(),
    type: Joi.string()
      .trim()
      .required(),
    jobOptions: Joi.object({
      attempts: Joi.number().min(0),
      delay: Joi.number().min(0),
      priority: Joi.number().min(1),
      repeat: Joi.object({
        every: Joi.number().min(0),
        cron: Joi.string(),
        limit: Joi.number().min(1),
      }),
    }),
  },
};

export const deleteJobRule = {
  params: {
    id: Joi.string()
      .trim()
      .required(),
  },
};

export const runJobRule = {
  params: {
    id: Joi.string()
      .trim()
      .required(),
  },
};

export const editJobRule = {
  params: {
    id: Joi.string()
      .trim()
      .required(),
  },
  body: {
    name: Joi.string()
      .trim()
      .required(),
    jobOptions: Joi.object({
      attempts: Joi.number().min(0),
      delay: Joi.number().min(0),
      priority: Joi.number().min(1),
      repeat: Joi.object({
        every: Joi.number().min(0),
        cron: Joi.string(),
        limit: Joi.number().min(1),
      }),
    }),
  },
};

export const pauseJobRule = {
  params: {
    id: Joi.string()
      .trim()
      .required(),
  },
};

export const getJobLogDetailRule = {
  query: {
    type: Joi.string()
      .trim()
      .required(),
    id: Joi.string()
      .trim()
      .required(),
  },
};

export const restartJobRule = {
  body: {
    jobId: Joi.string()
      .trim()
      .required(),
    type: Joi.string()
      .trim()
      .required(),
  },
};

export default {
  queuesRule,
  jobsRule,
  addJobRule,
  deleteJobRule,
  runJobRule,
  editJobRule,
  pauseJobRule,
  getJobLogDetailRule,
  restartJobRule,
};
