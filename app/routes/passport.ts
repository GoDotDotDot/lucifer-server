import { Application } from 'egg';
import {
  loginRule,
  register,
  twoFALogin,
  passwordResetMethod,
  resetPassword,
} from '@validate/passport';

/**
 * 用户相关的路由
 */
export default (app: Application) => {
  const {
    middleware: { auth },
  } = app;

  return {
    'passport.login': {
      method: 'POST',
      path: '/api/passport/login',
      options: {
        tags: ['passport'],
        description: '登录',
        handler: app.controller.passport.login,
        validate: loginRule,
      },
    },
    'passport.register': {
      method: 'POST',
      path: '/api/passport/register',
      options: {
        tags: ['passport'],
        description: '注册',
        handler: app.controller.passport.register,
        validate: register,
      },
    },
    'passport.logout': {
      method: 'GET',
      path: '/api/passport/logout',
      options: {
        tags: ['passport'],
        description: '退出登录',
        handler: app.controller.passport.logout,
      },
    },
    'passport.2faLogin': {
      method: 'POST',
      path: '/api/passport/2fa-login',
      options: {
        tags: ['passport'],
        description: '二次登录',
        handler: app.controller.passport.twoFALogin,
        validate: twoFALogin,
      },
    },
    'passport.passwordResetMethod': {
      method: 'GET',
      path: '/api/passport/password-reset-method',
      options: {
        tags: ['passport'],
        description: '用户重置密码的校验方式',
        handler: app.controller.passport.passwordResetMethod,
        validate: passwordResetMethod,
      },
    },
    'passport.resetPassword': {
      method: 'POST',
      path: '/api/passport/reset-password',
      options: {
        tags: ['passport'],
        description: '重置密码',
        handler: app.controller.passport.resetPassword,
        validate: resetPassword,
      },
    },
    'passport.ping': {
      method: 'GET',
      path: '/api/passport/ping',
      options: {
        tags: ['passport'],
        description: '获取登陆状态',
        handler: app.controller.passport.ping,
        middlewares: [auth()],
      },
    },
  };
};
