import { Application } from 'egg';
import { update, passwordUpdate } from '@validate/user';
/**
 * 用户相关的路由
 */
export default (app: Application) => {
  const { auth } = app.middleware;

  return {
    'user.get': {
      method: 'GET',
      path: '/api/user',
      options: {
        tags: ['user'],
        description: '获取用户信息',
        handler: app.controller.user.getUser,
        middlewares: [auth()],
      },
    },
    'user.update': {
      method: 'PUT',
      path: '/api/user',
      options: {
        tags: ['user'],
        description: '用户信息更新',
        handler: app.controller.user.update,
        validate: update,
        middlewares: [auth()],
      },
    },
    'user.password.update': {
      method: 'PUT',
      path: '/api/user/password',
      options: {
        tags: ['user'],
        description: '修改密码',
        handler: app.controller.user.passwordUpdate,
        validate: passwordUpdate,
        middlewares: [auth()],
      },
    },
    'user.module.list': {
      method: 'GET',
      path: '/api/user/module/list',
      options: {
        tags: ['user'],
        description: '用户的可用模块获取',
        handler: app.controller.user.moduleList,
        middlewares: [auth()],
      },
    },
  };
};
