import { Application } from 'egg';
import {
  list,
  createRule,
  updateRule,
  destroyRule,
  resetPasswordRule,
} from '@validate/auth/user';

/**
 * 权限管理相关路由
 */
export default (app: Application) => {
  const { auth } = app.middleware;

  return {
    'auth.user.list': {
      method: 'GET',
      path: '/api/auth/user/list',
      options: {
        tags: ['auth/user'],
        description: '用户列表',
        handler: app.controller.auth.user.list,
        middlewares: [auth('auth.user.list')],
        validate: list,
      },
    },
    'auth.user.create': {
      method: 'POST',
      path: '/api/auth/user',
      options: {
        tags: ['auth/user'],
        description: '新建用户',
        handler: app.controller.auth.user.create,
        middlewares: [auth('auth.user.create')],
        validate: createRule,
      },
    },
    'auth.user.destroy': {
      method: 'DELETE',
      path: '/api/auth/user/:id',
      options: {
        tags: ['auth/user'],
        description: '删除用户',
        handler: app.controller.auth.user.destroy,
        middlewares: [auth('auth.user.destroy')],
        validate: destroyRule,
      },
    },
    'auth.user.update': {
      method: 'PUT',
      path: '/api/auth/user/:id',
      options: {
        tags: ['auth/user'],
        description: '修改用户详情',
        handler: app.controller.auth.user.update,
        validate: updateRule,
        middlewares: [auth('auth.user.update')],
      },
    },
    'user.password.reset': {
      method: 'PUT',
      path: '/api/user/:id/reset-password',
      options: {
        tags: ['user'],
        description: '管理员重置密码',
        handler: app.controller.auth.user.resetPassword,
        validate: resetPasswordRule,
        middlewares: [auth('auth.user.setPassword')],
      },
    },
  };
};
