import { Application } from 'egg';
import {
  emailSendRule,
  verifyRule,
  authRule,
  generateGARule,
  bindGARule,
  enableGAAuthRule,
  disableGAAuthRule,
  twoFAListRule,
  bindEmailRule,
  enableEmailAuthRule,
  disableEmailAuthRule,
  editBindEmailRule,
  editBindGARule,
} from '@validate/security-platform';
/**
 * 用户相关的路由
 */
export default (app: Application) => {
  const { auth } = app.middleware;

  return {
    'securityPlatform.email.send': {
      method: 'POST',
      path: '/api/security-platform/email-code/send',
      options: {
        tags: ['security-platform'],
        description: '发送邮箱验证码',
        handler: app.controller.securityPlatform.emailSend,
        validate: emailSendRule,
      },
    },
    'securityPlatform.strategy.verify': {
      method: 'POST',
      path: '/api/security-platform/strategy/verify',
      options: {
        tags: ['security-platform'],
        description: '验证验证码',
        handler: app.controller.securityPlatform.verify,
        validate: verifyRule,
      },
    },
    'securityPlatform.strategy.auth': {
      method: 'POST',
      path: '/api/security-platform/strategy/auth',
      options: {
        tags: ['security-platform'],
        description: '验证 token 合法性',
        handler: app.controller.securityPlatform.auth,
        validate: authRule,
      },
    },
    'securityPlatform.ga.secret': {
      method: 'GET',
      path: '/api/security-platform/ga/secret',
      options: {
        tags: ['security-platform'],
        description: '生成 GA 秘钥',
        handler: app.controller.securityPlatform.generateGASecret,
        middlewares: [auth()],
        validate: generateGARule,
      },
    },
    'securityPlatform.ga.bind': {
      method: 'POST',
      path: '/api/security-platform/ga/bind',
      options: {
        tags: ['security-platform'],
        description: '绑定 GA',
        handler: app.controller.securityPlatform.bindGA,
        middlewares: [auth()],
        validate: bindGARule,
      },
    },
    'securityPlatform.ga.enable': {
      method: 'POST',
      path: '/api/security-platform/ga/enable',
      options: {
        tags: ['security-platform'],
        description: '开启谷歌验证',
        handler: app.controller.securityPlatform.enableGAAuth,
        middlewares: [auth()],
        validate: enableGAAuthRule,
      },
    },
    'securityPlatform.ga.disable': {
      method: 'POST',
      path: '/api/security-platform/ga/disable',
      options: {
        tags: ['security-platform'],
        description: '关闭谷歌验证',
        handler: app.controller.securityPlatform.disableGAAuth,
        middlewares: [auth()],
        validate: disableGAAuthRule,
      },
    },
    'securityPlatform.ga.edit': {
      method: 'POST',
      path: '/api/security-platform/ga/edit',
      options: {
        tags: ['security-platform'],
        description: '编辑谷歌验证',
        handler: app.controller.securityPlatform.editBindGA,
        middlewares: [auth()],
        validate: editBindGARule,
      },
    },
    'securityPlatform.strategy.list': {
      method: 'GET',
      path: '/api/security-platform/strategy/list',
      options: {
        tags: ['security-platform'],
        description: '获取二次验证列表',
        handler: app.controller.securityPlatform.twoFAList,
        middlewares: [auth()],
        validate: twoFAListRule,
      },
    },
    'securityPlatform.email.bind': {
      method: 'POST',
      path: '/api/security-platform/email/bind',
      options: {
        tags: ['security-platform'],
        description: '绑定邮箱',
        handler: app.controller.securityPlatform.bindEmail,
        middlewares: [auth()],
        validate: bindEmailRule,
      },
    },
    'securityPlatform.email.edit': {
      method: 'POST',
      path: '/api/security-platform/email/edit',
      options: {
        tags: ['security-platform'],
        description: '关闭手机短信验证',
        handler: app.controller.securityPlatform.editBindEmail,
        middlewares: [auth()],
        validate: editBindEmailRule,
      },
    },
    'securityPlatform.email.enable': {
      method: 'POST',
      path: '/api/security-platform/email/enable',
      options: {
        tags: ['security-platform'],
        description: '开启邮箱验证',
        handler: app.controller.securityPlatform.enableEmailAuth,
        middlewares: [auth()],
        validate: enableEmailAuthRule,
      },
    },
    'securityPlatform.email.disable': {
      method: 'POST',
      path: '/api/security-platform/email/disable',
      options: {
        tags: ['security-platform'],
        description: '关闭邮箱验证',
        handler: app.controller.securityPlatform.disableEmailAuth,
        middlewares: [auth()],
        validate: disableEmailAuthRule,
      },
    },
  };
};
