import { Application } from 'egg';
import {
  createRule,
  updateRule,
  list,
  destroyRule,
} from '@validate/auth/module';

/**
 * 模块管理相关的路由
 */
export default (app: Application) => {
  const { auth } = app.middleware;

  return {
    'auth.module.list': {
      method: 'GET',
      path: '/api/auth/module/list',
      options: {
        tags: ['auth/module'],
        description: '模块列表',
        handler: app.controller.auth.module.list,
        middlewares: [auth('auth.module.list')],
        validate: list,
      },
    },
    'auth.module.create': {
      method: 'POST',
      path: '/api/auth/module',
      options: {
        tags: ['auth/module'],
        description: '添加模块',
        handler: app.controller.auth.module.create,
        middlewares: [auth('auth.module.create')],
        validate: createRule,
      },
    },
    'auth.module.destroy': {
      method: 'DELETE',
      path: '/api/auth/module/:id',
      options: {
        tags: ['auth/module'],
        description: '删除模块',
        handler: app.controller.auth.module.destroy,
        middlewares: [auth('auth.module.destroy')],
        validate: destroyRule,
      },
    },
    'auth.module.update': {
      method: 'PUT',
      path: '/api/auth/module/:id',
      options: {
        tags: ['auth/module'],
        description: '修改模块详情',
        handler: app.controller.auth.module.update,
        middlewares: [auth('auth.module.update')],
        validate: updateRule,
      },
    },
    'auth.module.system': {
      method: 'GET',
      path: '/api/auth/module/system',
      options: {
        tags: ['auth/module'],
        description: '系统级模块列表',
        handler: app.controller.auth.module.system,
        middlewares: [auth('auth.module.system')],
      },
    },
  };
};
