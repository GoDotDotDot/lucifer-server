'use strict';

module.exports = {
  async up(db) {
    const now = new Date();
    await db.collection('common_config_attrs').insertMany([
      {
        configName: '2fa',
        field: 'codeTemplate',
        name: '验证码模板',
        type: 'TEXT',
        isRequired: true,
        defaultValue: '【lucifer】您的验证码是 #code#',
        helpText: '验证码模板，如：【lucifer】您的验证码是 #code#',
        order: 1,
        isOccupyOneline: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        configName: '2fa',
        field: 'emailSkip',
        name: '是否跳过邮箱验证码发送',
        type: 'RADIO',
        isRequired: true,
        defaultValue: false,
        isOccupyOneline: false,
        helpText: '如果跳过，则点击发送后，可以使用 111111 通过验证',
        options: ['true:跳过', 'false:正常'],
        order: 6,
        createdAt: now,
        updatedAt: now,
      },
      {
        configName: '2fa',
        field: 'gaSkip',
        name: '是否跳过谷歌验证码计算（暂未实现）',
        type: 'RADIO',
        isRequired: true,
        defaultValue: false,
        isOccupyOneline: false,
        helpText: '如果跳过，则在验证谷歌验证码时，可以使用 111111 通过验证',
        options: ['true:跳过', 'false:正常'],
        order: 6,
        createdAt: now,
        updatedAt: now,
      },
    ]);
    await db.collection('common_configs').insertOne({
      name: '2fa',
      value: {},
      createdAt: now,
      updatedAt: now,
    });
  },

  async down(db) {
    await db.collection('common_config_attrs').deleteMany({
      configName: '2fa',
    });
    await db.collection('common_configs').deleteOne({ name: '2fa' });
  },
};
