const mongoose = require('mongoose');

class RbacTreeBuilder {
  constructor(tree) {
    if (typeof tree !== 'object') {
      throw new Error('not a object');
    }
    this.tree = tree;
    this.run();
  }

  async up(db) {
    await db.collection('auth_modules').insertMany(this.getList());
    await db.collection('auth_groups').updateOne(
      { name: 'admin' },
      {
        $addToSet: {
          modules: {
            $each: this.getUris(),
          },
        },
      },
    );
  }

  async down(db) {
    // 删除权限
    await db.collection('auth_modules').deleteMany({
      uri: {
        $in: this.getUris(),
      },
    });

    // 给 admin 组重新分配权限
    const sourceModules = await db.collection('auth_modules').find();
    const sourceModulesArray = await sourceModules.toArray();
    const moduleIds = sourceModulesArray.map(x => x.uri);
    await db.collection('auth_groups').updateOne(
      {
        name: 'admin',
      },
      {
        $set: {
          modules: [...moduleIds],
        },
      },
    );
  }

  findParentUri(key) {
    const group = key.split('.');
    group.pop();
    return group.join('.');
  }
  run() {
    const map = {};
    const now = new Date();
    for (const key in this.tree) {
      let item = {
        _id: mongoose.Types.ObjectId(),
        parentId: '',
        name: '',
        uri: key,
        url: '',
        icon: '',
        describe: '',
        sort: 0,
        createdAt: now,
        updatedAt: now,
        system: true, // 系统内置
      };
      if (typeof this.tree[key] === 'string') {
        item.name = this.tree[key];
      } else {
        item = Object.assign(item, this.tree[key]);
      }

      map[key] = item;
    }

    for (const key in map) {
      const item = map[key];
      item.parentId = this.findParentUri(key);
      map[key] = item;
    }
    this.output = map;
  }
  /**
   * 获取所有权限的 _id
   */
  getObjectIdString() {
    return Object.values(this.output).map(item => `${item._id}`);
  }

  getList() {
    return Object.values(this.output);
  }

  getUris() {
    return Object.keys(this.output);
  }
}

module.exports = {
  RbacTreeBuilder,
};
