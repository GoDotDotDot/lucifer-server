const RbacTreeBuilder = require('./helper/rbac').RbacTreeBuilder;

const rbacBuilder = new RbacTreeBuilder({
  'user.notice': {
    name: '消息通知',
    isMenu: false,
    url: '/user/notice',
    icon: 'bell',
    parentId: 'user',
  },
  notice: '消息通知',
  'notice.del': '删除消息通知',
  'notice.readed': '标记消息通知为已读',
});

module.exports = {
  async up(db) {
    await rbacBuilder.up(db);
  },
  async down(db) {
    await rbacBuilder.down(db);
  },
};
