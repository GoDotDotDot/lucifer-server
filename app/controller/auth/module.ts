import { pick } from 'lodash';
import { Controller } from 'egg';
import { AuthModuleSchema } from 'model/auth_module';

export default class AuthMenuController extends Controller {
  async list() {
    const { page, pageSize, ...where } = this.ctx.validateReq(
      'auth.module.list',
    ).query;

    const moduleService = this.ctx.service.auth.module;
    const result = await moduleService.paginate<AuthModuleSchema>(where, {
      page,
      pageSize,
    });

    this.ctx.success({
      data: {
        ...result,
        list: result.list.map(obj => {
          return pick(obj, [
            'id',
            'name',
            'url',
            'uri',
            'icon',
            'describe',
            'sort',
            'show',
            'isMenu',
            'parentId',
            'parent_name',
            'system',
          ]);
        }),
      },
    });
  }

  async create() {
    const { body } = this.ctx.validateReq('auth.module.create');

    if (body.uri) {
      const isExist = await this.ctx.model.AuthModule.findOne({
        uri: body.uri,
      });

      if (isExist) {
        this.ctx.badRequest({
          code: 10008,
          data: {
            uri: body.uri,
          },
        });

        return false;
      }
    }

    const result = await this.ctx.service.auth.module.create(body);

    this.ctx.success({
      data: {
        id: result.id,
      },
    });
  }

  async destroy(ctx) {
    const {
      params: { id },
    } = this.ctx.validateReq('auth.module.destroy');

    const isExist = await this.ctx.model.AuthModule.findOne({
      _id: id,
      system: { $ne: true },
    });
    if (!isExist) {
      return this.ctx.notFound({
        code: 10009,
        data: {
          id,
        },
      });
    }

    // 有子模块的禁止删除
    const hasChild = await this.ctx.model.AuthModule.findOne({
      parentId: id,
    });

    if (hasChild) {
      return this.ctx.badRequest({
        code: 10010,
        data: {
          id,
        },
      });
    }

    await ctx.service.auth.module.destroy(id);

    this.ctx.success({
      data: {
        id,
      },
    });
  }

  async update() {
    const {
      body,
      params: { id },
    } = this.ctx.validateReq('auth.module.update');

    const isUriExist = await this.ctx.model.AuthModule.findOne({
      _id: {
        $ne: id,
      },
      uri: body.uri,
    });
    if (isUriExist) {
      return this.ctx.badRequest({
        code: 10008,
        data: {
          uri: body.uri,
        },
      });
    }

    const result = await this.ctx.service.auth.module.update(id, body);

    this.ctx.success({
      data: {
        id: result.insertId,
      },
      status: 201,
    });
  }

  async system() {
    const result = await this.ctx.service.auth.module.system({});

    this.ctx.success({ data: result });
  }
}
