'use strict';

module.exports = {
  async up(db) {
    const now = new Date();
    await db.collection('common_config_attrs').insertMany([
      {
        configName: 'email',
        field: 'emailHost',
        name: 'SMTP 地址',
        type: 'TEXT',
        isRequired: true,
        defaultValue: '',
        helpText: '发件人服务器地址',
        order: 1,
        isOccupyOneline: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        configName: 'email',
        field: 'emailPort',
        name: 'SMTP 端口',
        type: 'TEXT',
        isRequired: true,
        defaultValue: '25',
        helpText: '邮件发送服务器端口',
        order: 2,
        isOccupyOneline: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        configName: 'email',
        field: 'emailUsername',
        name: '邮箱用户名',
        type: 'TEXT',
        isRequired: true,
        defaultValue: '',
        helpText: '邮箱用户名',
        order: 3,
        isOccupyOneline: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        configName: 'email',
        field: 'emailPassword',
        name: '邮箱密码',
        type: 'PASSWORD',
        isRequired: true,
        defaultValue: '',
        helpText: '邮箱密码',
        isOccupyOneline: false,
        order: 4,
        createdAt: now,
        updatedAt: now,
      },
      {
        configName: 'email',
        field: 'emailPersonal',
        name: '发件人',
        type: 'TEXT',
        isRequired: true,
        defaultValue: '',
        helpText: '一般同邮箱用户名',
        isOccupyOneline: false,
        order: 5,
        createdAt: now,
        updatedAt: now,
      },
      {
        configName: 'email',
        field: 'emailValidate',
        name: '是否开启邮箱验证',
        type: 'RADIO',
        isRequired: true,
        defaultValue: false,
        isOccupyOneline: false,
        options: ['true:是', 'false:否'],
        helpText: '',
        order: 6,
        createdAt: now,
        updatedAt: now,
      },
    ]);
    await db.collection('common_configs').insertOne({
      name: 'email',
      value: {},
      createdAt: now,
      updatedAt: now,
    });
  },

  async down(db) {
    await db.collection('common_config_attrs').deleteMany({
      configName: 'email',
    });
    await db.collection('common_configs').deleteOne({ name: 'email' });
  },
};
