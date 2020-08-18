import { omit } from 'lodash';
import { Controller } from 'egg';

export default class AuthUserController extends Controller {
  async list() {
    const { query } = this.ctx.validateReq('auth.user.list');
    const { page, pageSize, ...where } = query;

    const result = await this.ctx.service.auth.user.list(page, pageSize, where);

    this.ctx.success({
      data: {
        ...result,
        list: result.list.map(obj => {
          return omit(obj, ['password']);
        }),
      },
    });
  }

  async create() {
    const { body } = this.ctx.validateReq('auth.user.create');
    const isAccountExist = await this.ctx.model.AuthUser.findOne({
      account: body.account,
    });

    if (isAccountExist) {
      this.ctx.badRequest({
        code: 10002,
        data: {
          account: body.account,
        },
      });
      return false;
    }

    const result = await this.ctx.service.auth.user.create(body);

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
    const {
      params: { id },
    } = this.ctx.validateReq('auth.user.destroy');

    if (this.ctx.user.id === id) {
      return this.ctx.failure({ code: 10022 });
    }

    const result = await this.ctx.service.auth.user.destroy(id);

    if (!result) {
      return this.ctx.notFound({
        code: 10003,
        data: {
          id,
        },
      });
    }

    this.ctx.success();
  }

  async update() {
    const {
      body,
      params: { id },
    } = this.ctx.validateReq('auth.user.update');

    const result = await this.ctx.service.auth.user.update(id, body);

    if (!result) {
      return this.ctx.notFound({
        code: 10003,
        data: {
          id,
        },
      });
    }

    this.ctx.success();
  }

  async resetPassword() {
    const { params } = this.ctx.validateReq('user.password.reset');
    const { id } = params;

    const user = await this.ctx.service.auth.user.getUserById(id);
    if (!user) {
      return this.ctx.failure({ code: 10003 });
    }

    const password = '111111';

    const rst = await this.ctx.service.auth.user.update(id, { password });
    if (!rst) {
      return this.ctx.failure({ code: 10015 });
    }

    this.ctx.success();
  }
}
