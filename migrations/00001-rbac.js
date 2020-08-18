'use strict';

const RbacTreeBuilder = require('./helper/rbac').RbacTreeBuilder;
/**
 * 定义权限树
 * 权限树按照 "." 进行节点依赖关系关联，如 auth.group 的上级节点就是 auth, auth.group.edit 的上级是 auth.group
 * 权限树按照扁平的结构进行添加，一个项目的值可以是一个对象或一个字符串，如果是字符串，则会生成一个 {name: '字符串'}  的结构
 * 如果是对象，可以填写 {name: 'xxx', icon: '', url: '', isMenu: true} 等参数
 */
const rbacTree = {
  home: {
    name: '首页',
    url: '/',
  },
  auth: {
    name: '权限管理',
    isMenu: true,
    url: '/auth',
    icon: 'lock',
    sort: 1,
  },
  'auth.group': {
    name: '用户组管理',
    isMenu: true,
    url: '/auth/group',
    icon: 'team',
  },
  'auth.group.list': '用户组列表',
  'auth.group.create': '添加用户组',
  'auth.group.update': '修改用户组详情',
  'auth.group.destroy': '删除用户组',
  'auth.group.users': '成员查看',
  'auth.group.users.update': '成员设置',
  'auth.group.modules': '权限查看',
  'auth.group.modules.update': '权限设置',
  'auth.module': {
    name: '功能模块管理',
    isMenu: true,
    url: '/auth/modules',
    icon: 'appstore',
  },
  'auth.module.list': '模块列表',
  'auth.module.create': '添加模块',
  'auth.module.destroy': '删除模块',
  'auth.module.system': '系统级模块列表',
  'auth.module.update': '修改模块详情',
  'auth.user': {
    name: '用户管理',
    isMenu: true,
    url: '/auth/users',
    icon: 'user',
  },
  'auth.user.create': '新建用户',
  'auth.user.destroy': '删除用户',
  'auth.user.list': '用户列表',
  'auth.user.setPassword': '重置密码',
  'auth.user.update': '修改用户详情',

  sys: {
    name: '系统配置',
    isMenu: true,
    url: '/sys/config',
    icon: 'setting',
    sort: 4,
  },
  'sys.app': {
    name: '业务应用配置',
    isMenu: true,
    url: '/sys/config/app',
    icon: 'appstore',
  },
  'sys.app.update': '业务应用配置修改',
  'sys.email': {
    name: '邮箱配置',
    isMenu: true,
    url: '/sys/config/email',
    icon: 'mail',
  },
  'sys.email.update': '邮箱配置更新',
  'sys.sms': {
    name: '短信配置',
    isMenu: true,
    url: '/sys/config/sms',
    icon: 'message',
  },
  'sys.sms.update': '短信配置更新',
  'sys.2fa': {
    name: '二次验证配置',
    isMenu: true,
    url: '/sys/config/2fa',
    icon: 'safety-certificate',
  },
  'sys.2fa.update': '二次验证配置更新',
  'sys.site': {
    name: '站点配置',
    isMenu: true,
    url: '/sys/config/site',
    icon: 'ie',
  },
  'sys.site.update': '站点配置更新',
  'sys.geetest': {
    name: '极验配置',
    isMenu: true,
    url: '/sys/config/geetest',
    icon: 'check-circle',
  },
  'sys.geetest.update': '更新极验配置',
  auditLog: '审计日志',
  'auditLog.list': '查询审计日志',
};

const rbacBuilder = new RbacTreeBuilder(rbacTree);

module.exports = {
  async up(db) {
    // 创建 admin 用户
    const now = new Date();
    const admin = await db.collection('auth_users').insertOne({
      account: 'admin',
      password: '390bb34abe76b825a64b05736507d0c9',
      registerType: 'local',
      name: '超级管理员',
      email: 'admin@admin.com',
      updatedAt: now,
      createdAt: now,
      mobile: '18711111117',
    });
    // 创建 admin 用户组
    await db.collection('auth_groups').insertOne({
      name: 'admin',
      updatedAt: now,
      createdAt: now,
      describe: '超级管理员',
      users: [admin.insertedId.toString()],
    });
    // 创建 test 用户
    const testUser = await db.collection('auth_users').insertOne({
      account: 'test',
      password: '390bb34abe76b825a64b05736507d0c9',
      registerType: 'local',
      name: 'test',
      email: 'test@test.com',
      updatedAt: now,
      createdAt: now,
      mobile: '18722222222',
    });
    // 创建 test 用户组
    await db.collection('auth_groups').insertOne({
      name: 'test',
      describe: 'test',
      modules: [],
      users: [testUser.insertedId.toString()],
      updatedAt: now,
      createdAt: now,
    });

    // 写入权限项并给 admin 分配权限
    await rbacBuilder.up(db);
  },

  async down(db) {
    await db.collection('auth_users').deleteMany();
    await db.collection('auth_modules').deleteMany();
    await db.collection('auth_groups').deleteMany();
  },
};
