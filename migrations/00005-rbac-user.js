const RbacTreeBuilder = require('./helper/rbac').RbacTreeBuilder;

const rbacBuilder = new RbacTreeBuilder({
  user: {
    name: '个人中心',
    isMenu: false,
    url: '/user',
    icon: 'user',
    sort: 3,
  },
  'user.settings': {
    name: '个人设置',
    isMenu: false,
    url: '/user/settings',
    icon: 'smile',
    parentId: 'user',
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
