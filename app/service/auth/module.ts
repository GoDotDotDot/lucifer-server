import Service from '@core/baseService';
import { AuthModuleSchema } from 'model/auth_module';

export default class ModuleService extends Service {
  constructor(ctx) {
    super(ctx);
    this.model = ctx.model.AuthModule;
  }

  getParentId(key: string) {
    if (typeof key !== 'string') {
      return '';
    }
    const keys = key.split('.');
    keys.pop();
    return keys.join('.');
  }

  async create(data) {
    data.parentId = this.getParentId(data.uri);
    const result = this.model.create(data);

    return result;
  }

  async destroy(id) {
    const result = await this.model.remove({
      _id: id,
    });

    // 删除用户组集合中与此模块相关的数据
    this.ctx.model.AuthGroup.update(
      {},
      {
        $pull: { modules: id },
      },
    );

    return result.n !== 0 && result;
  }

  async edit(id) {
    const result = await this.model.findOne({
      _id: id,
    });
    return result;
  }

  async update(id, data) {
    try {
      return await this.model
        .findByIdAndUpdate(
          id,
          {
            ...data,
            parentId: this.getParentId(data.uri),
          },
          {
            new: true,
            runValidators: true,
          },
        )
        .exec();
    } catch (err) {
      this.ctx.logger.error(err.message);
      return '';
    }
  }

  async system(opts) {
    const isAll = !opts.filterHide;
    const id = opts.parentId;
    let originalObj: AuthModuleSchema[] = [];

    if (isAll) {
      originalObj = await this.model.find(
        {},
        {
          uri: 1,
          name: 1,
          sort: 1,
          parentId: 1,
        },
      );
    } else {
      originalObj = await this.model.find();
    }

    const subset = parentId => {
      // 根据父级id遍历子集
      const arr: typeof originalObj = [];

      // 查询该id下的所有子集
      originalObj.forEach((obj: AuthModuleSchema) => {
        if (
          (obj.parentId ? obj.parentId.toString() : obj.parentId) === parentId
        ) {
          arr.push(
            Object.assign(obj.toJSON(), {
              children: subset(obj.uri),
            }),
          );
        }
      });

      // 如果没有子集 直接退出
      if (arr.length === 0) {
        return [];
      }

      // 对子集进行排序
      arr.sort((val1, val2) => {
        if (val1.sort < val2.sort) {
          return -1;
        } else if (val1.sort > val2.sort) {
          return 1;
        }
        return 0;
      });
      return arr;
    };

    return subset(id || '');
  }
}
