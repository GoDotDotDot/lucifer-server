import { Application } from 'egg';

/**
 * 用户相关的路由
 */
export default (app: Application) => {
  const { auth } = app.middleware;

  return {
    'sys.email.get': {
      method: 'GET',
      path: '/api/sys/email',
      options: {
        tags: ['sys'],
        handler: app.controller.sys.getInfo,
        middlewares: [auth()],
      },
    },
    'sys.email.update': {
      method: 'PUT',
      path: '/api/sys/email',
      options: {
        tags: ['sys'],
        description: '修改邮箱配置',
        handler: app.controller.sys.update,
        middlewares: [auth('sys.email.update')],
      },
    },
    'sys.2fa.get': {
      method: 'GET',
      path: '/api/sys/2fa',
      options: {
        tags: ['sys'],
        handler: app.controller.sys.getInfo,
        middlewares: [auth()],
      },
    },
    'sys.2fa.update': {
      method: 'PUT',
      path: '/api/sys/2fa',
      options: {
        tags: ['sys'],
        description: '修改二次验证配置',
        handler: app.controller.sys.update,
        middlewares: [auth('sys.2fa.update')],
      },
    },
    'sys.main.healthCheck': {
      method: 'GET',
      path: '/api/sys/healthcheck',
      options: {
        tags: ['sys'],
        description: '健康检查',
        handler: app.controller.sys.healthCheck,
      },
    },
  };
};
