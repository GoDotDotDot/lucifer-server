import { Controller } from 'egg';
import { flattenDeep } from 'lodash';
import { BIZ_CODE } from 'common/constants';

export default class UserController extends Controller {
  async getUser() {
    const { id } = this.ctx.user;
    const user = await this.ctx.model.AuthUser.findOne(
      {
        _id: id,
      },
      {
        _id: 0,
        account: 1,
        name: 1,
        email: 1,
        mobile: 1,
        ga: 1,
        description: 1,
        twoFA: 1,
      },
    ).lean();

    this.ctx.success({
      data: {
        ...user,
        ga: Boolean(user && user.ga),
        id,
      },
    });
  }

  async update() {
    const {
      body: { name, description },
    } = this.ctx.validateReq('user.update');

    const userInfo: { name: string; description?: string } = { name };
    if (description) userInfo.description = description;

    await this.ctx.model.AuthUser.findByIdAndUpdate(this.ctx.user.id, {
      $set: userInfo,
    });

    this.ctx.success({ msg: '用户信息更新成功' });
  }

  async passwordUpdate() {
    const id = this.ctx.user.id;
    const {
      body: { oldPassword, password, bizCode, token },
    } = this.ctx.validateReq('user.password.update');

    const {
      config: { saltPassword },
    } = this.app;

    if (oldPassword === password) {
      return this.ctx.failure({ code: 10017 });
    }

    const user = await this.ctx.model.AuthUser.findOne({
      _id: id,
      password: this.ctx.helper.md5(`${saltPassword}${oldPassword}`),
    });
    if (!user) {
      return this.ctx.failure({ code: 10016 });
    }

    const { twoFA } = user;
    if (twoFA.email || twoFA.sms || twoFA.ga) {
      if (bizCode !== BIZ_CODE.UPDATE_PASSWORD) {
        return this.ctx.failure({ code: 10026 });
      }
      const { status, result } = await this.service.securityPlatform.auth(
        token,
        bizCode,
      );
      if (!status) {
        return this.ctx.failure({ code: 10026, data: result });
      }
    }

    const result = await this.ctx.service.user.setPassword(id, password);

    if (!result) {
      return this.ctx.notFound({ code: 10003 });
    }

    this.ctx.success({ msg: '密码设置成功' });
  }

  /**
   * 获取页面路由资源，本接口包含菜单和页面路由（即不出现在菜单中的）
   * 菜单数据获取请根据 isMenu 是够为 true 来区分
   * 整体思路：
   * 用户 ID --> 查询用户组 --> 查询用户组下的模块 --> 追加父节点 --> 返回数据
   */
  async moduleList() {
    // 根据用户id查询用户所在的用户组，有可能有多个
    const groups = await this.ctx.model.AuthGroup.find(
      {
        users: this.ctx.user.id,
      },
      {
        modules: 1,
      },
    );

    // 获取用户组下的所有模块 uri 并去重
    const modulesUri = flattenDeep<string>(
      groups.map(group => group.toJSON().modules),
    );

    const sets = new Set<string>(modulesUri);

    // 获取功能模块
    const modules = await this.ctx.model.AuthModule.find(
      {
        uri: {
          $in: [...sets],
        },
      },
      {
        createdAt: 0,
        updatedAt: 0,
        _id: 0,
      },
    ).lean();

    this.ctx.success({
      data: modules,
    });
  }
}
