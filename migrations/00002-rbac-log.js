const RbacTreeBuilder = require('./helper/rbac').RbacTreeBuilder;

const rbacBuilder = new RbacTreeBuilder({
  logs: {
    name: '日志管理',
    isMenu: true,
    url: '/logs',
    icon: 'form',
    sort: 2,
  },
  'logs.audit': {
    name: '审计日志',
    isMenu: true,
    url: '/logs/audit',
    parentId: 'logs',
  },
});

module.exports = {
  async up(db) {
    await rbacBuilder.up(db);
  },
  async down(db) {
    await rbacBuilder.down(db);
  },
};
