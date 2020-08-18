import Service from '@core/baseService';
import { AuthUserSchema } from 'model/auth_user';

export default class UserService extends Service {
  public groupModel;
  constructor(ctx) {
    super(ctx);

    this.ctx = ctx;
    this.model = ctx.model.AuthUser;
    this.groupModel = ctx.model.AuthGroup;
  }

  async list(page = 1, pageSize = 20, query) {
    let list: AuthUserSchema[] = [];
    let total = 0;
    let queryObj = { ...query };

    // 查询条件有用户组时，直接找出该角色下的所有用户，然后再根据其他query查询
    if (query.group) {
      // 用户组的name唯一，所以结果只有一个。
      const currentGroup = await this.groupModel.findById(query.group);
      // 当该用户组下没有用户，不再查询，直接返回结果
      if (currentGroup.users.length === 0) {
        return {
          list,
          total,
          page,
          pageSize,
        };
      }

      queryObj = {
        _id: {
          $in: currentGroup.users,
        },
        ...query,
      };
      // 删除无用的 group 属性
      delete queryObj.group;
    }

    list = await this.model
      .find(queryObj)
      .skip((Number(page) - 1) * pageSize)
      .limit(Number(pageSize));
    total = await this.model.find(queryObj).countDocuments();

    if (list.length !== 0) {
      // 查询每个账号所在的用户组信息
      const idList = list.map(item => item._id.toString());
      // 查出所有包含id的用户组
      const groups = await this.ctx.model.AuthGroup.find({
        users: {
          $in: idList,
        },
      });
      // 遍历用户，过滤出包含用户id的用户组，返回用户组名称
      // 将用户组名称放入用户信息中，key为 userGroups
      list = list.map(user => {
        const userGroups = groups
          .filter(group => {
            return group.users.includes(user._id);
          })
          .map(group => group.name);
        const result = {
          userGroups,
          ...user.toJSON(),
        };
        return result;
      });
    }

    return {
      list,
      total,
      page,
      pageSize,
    };
  }

  async create(data) {
    const { config } = this.ctx.app;
    const result = await this.model.create(
      Object.assign(data, {
        password: this.ctx.helper.md5(`${config.saltPassword}${data.password}`),
      }),
    );

    return result;
  }

  async destroy(id) {
    const result = await this.model.deleteOne({
      _id: id,
    });

    // 删除用户组集合中与此用户相关的数据
    this.ctx.model.AuthGroup.update(
      {},
      {
        $pull: { users: id },
      },
    );

    return result;
  }

  async getUserById(id) {
    const result = await this.model.findOne({
      _id: id,
    });

    return result;
  }

  async update(id, data) {
    let newData = Object.assign(data, { _id: id });

    const { config } = this.ctx.app;
    if (data.password) {
      newData = Object.assign(newData, {
        password: this.ctx.helper.md5(`${config.saltPassword}${data.password}`),
      });
    }

    try {
      return await this.model
        .findByIdAndUpdate(id, newData, {
          new: true,
          runValidators: true,
        })
        .exec();
    } catch (err) {
      this.ctx.logger.error(err.message);
      return '';
    }
  }

  async findOne(account) {
    const result = await this.model.findOne({ account });
    return result;
  }

  async getUser(query) {
    return this.model.findOne(query);
  }
}
