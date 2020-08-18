import { pick } from 'lodash';
import { Controller } from 'egg';

export default class AuthGroupController extends Controller {
  async list() {
    const { page, pageSize, all, name } = this.ctx.validateReq(
      'auth.group.list',
    ).query;

    const result = await this.ctx.service.auth.group.paginate(
      { name },
      {
        page,
        pageSize,
        all,
      },
    );

    if (result) {
      this.ctx.success({
        data: {
          ...result,
          list: result.list.map(obj =>
            pick(obj, ['id', 'name', 'describe', 'users']),
          ),
        },
      });
    }
  }

  async create() {
    const { body } = this.ctx.validateReq('auth.group.create');

    const isExist = await this.ctx.model.AuthGroup.findOne({
      name: body.name,
    });

    if (isExist) {
      return this.ctx.failure({
        code: 10006,
        data: {
          name: body.name,
        },
      });
    }

    const result = await this.ctx.service.auth.group.create(body);

    if (result) {
      this.ctx.success({
        data: {
          id: result.id,
        },
        status: 201,
      });
    }
  }

  async destroy() {
    const { id } = this.ctx.validateReq('auth.group.destroy').params;

    const inGroup = await this.ctx.model.AuthGroup.findOne({
      _id: id,
      // eslint-disable-next-line
      // @ts-ignore
      users: { $in: this.ctx.user.id },
    });
    if (inGroup) {
      return this.ctx.failure({ code: 10023 });
    }

    await this.ctx.service.auth.group.destroy(id);

    this.ctx.success();
  }

  async update() {
    const { params, body } = this.ctx.validateReq('auth.group.update');
    const { id } = params;
    const query = body;

    const isExist = await this.ctx.model.AuthGroup.findOne({
      _id: {
        $ne: id,
      },
      name: query.name,
    });
    if (isExist) {
      this.ctx.failure({
        code: 10006,
        data: {
          name: query.name,
        },
      });

      return false;
    }

    const result = await this.ctx.service.auth.group.update(
      id,
      pick(query, ['name', 'describe']),
    );

    if (!result) {
      this.ctx.failure({
        code: 10007,
      });

      return false;
    }

    this.ctx.success();
  }

  async users() {
    const query = this.ctx.validateReq('auth.group.users').params;

    const addArr = await this.ctx.model.AuthGroup.findById(query.id);

    if (!addArr) {
      this.ctx.failure({ code: 10007 });
      return;
    }

    const allResult = await this.ctx.model.AuthUser.find();

    const allArr = allResult.map(obj => ({
      key: obj._id,
      title: obj.account,
    }));

    this.ctx.success({
      data: {
        addList: addArr.users || [],
        allList: allArr,
      },
    });
  }

  async usersUpdate() {
    const { params, body } = this.ctx.validateReq('auth.group.users.update');
    const roleId = params.id;
    const idList = body.idList;

    const result = await this.ctx.model.AuthGroup.findByIdAndUpdate(roleId, {
      $set: {
        users: idList,
      },
    });

    if (result === null) {
      this.ctx.failure({
        code: 10007,
        data: {
          idList,
        },
      });

      return false;
    }

    this.ctx.success();
  }

  async modules() {
    const query = this.ctx.validateReq('auth.group.modules').params;

    const addArr = await this.ctx.model.AuthGroup.findOne({
      _id: query.id,
    });

    const allResult = await this.ctx.service.auth.module.system({
      parentId: query.parentId || '',
    });

    this.ctx.success({
      data: {
        addList: addArr ? addArr.modules : [],
        allList: allResult,
      },
    });
  }

  async moduleUpdate() {
    const { params, body } = this.ctx.validateReq('auth.group.modules.update');
    const roleId = params.id;
    const idList = body.idList;

    // 给用户组集合插入user信息
    const result = await this.ctx.model.AuthGroup.findByIdAndUpdate(roleId, {
      $set: {
        modules: idList,
      },
    });

    if (result === null) {
      return this.ctx.failure({
        code: 10007,
        data: {
          idList,
        },
      });
    }

    this.ctx.success();
  }
}
