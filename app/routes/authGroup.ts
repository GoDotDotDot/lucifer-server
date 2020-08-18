import { Application } from 'egg';
import {
  createRule,
  indexRule,
  destroyRule,
  updateRule,
  setModuleRule,
  getModuleRule,
  setUserRule,
  getUserRule,
} from '@validate/auth/group';

/**
 * 用户组管理的路由
 */
export default (app: Application) => {
  const { auth } = app.middleware;

  return {
    'auth.group.list': {
      method: 'GET',
      path: '/api/auth/group/list',
      options: {
        tags: ['auth/group'],
        description: '用户组列表',
        handler: app.controller.auth.group.list,
        middlewares: [auth('auth.group.list')],
        validate: indexRule,
      },
    },
    'auth.group.create': {
      method: 'POST',
      path: '/api/auth/group',
      options: {
        tags: ['auth/group'],
        description: '添加用户组',
        handler: app.controller.auth.group.create,
        middlewares: [auth('auth.group.create')],
        validate: createRule,
      },
    },
    'auth.group.destroy': {
      method: 'DELETE',
      path: '/api/auth/group/:id',
      options: {
        tags: ['auth/group'],
        description: '删除用户组',
        handler: app.controller.auth.group.destroy,
        middlewares: [auth('auth.group.destroy')],
        validate: destroyRule,
      },
    },
    'auth.group.update': {
      method: 'PUT',
      path: '/api/auth/group/:id',
      options: {
        tags: ['auth/group'],
        description: '修改用户组详情',
        handler: app.controller.auth.group.update,
        middlewares: [auth('auth.group.update')],
        validate: updateRule,
      },
    },
    'auth.group.users': {
      method: 'GET',
      path: '/api/auth/group/:id/users',
      options: {
        tags: ['auth/group'],
        description: '成员查看',
        handler: app.controller.auth.group.users,
        middlewares: [auth('auth.group.users')],
        validate: getUserRule,
      },
    },
    'auth.group.users.update': {
      method: 'PUT',
      path: '/api/auth/group/:id/users',
      options: {
        tags: ['auth/group'],
        description: '成员设置',
        handler: app.controller.auth.group.usersUpdate,
        middlewares: [auth('auth.group.users.update')],
        validate: setUserRule,
      },
    },
    'auth.group.modules': {
      method: 'GET',
      path: '/api/auth/group/:id/modules',
      options: {
        tags: ['auth/group'],
        description: '权限查看',
        handler: app.controller.auth.group.modules,
        middlewares: [auth('auth.group.modules')],
        validate: getModuleRule,
      },
    },
    'auth.group.modules.update': {
      method: 'PUT',
      path: '/api/auth/group/:id/modules',
      options: {
        tags: ['auth/group'],
        description: '权限设置',
        handler: app.controller.auth.group.moduleUpdate,
        middlewares: [auth('auth.group.modules.update')],
        validate: setModuleRule,
      },
    },
  };
};
