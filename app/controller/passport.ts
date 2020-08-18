/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller } from 'egg';

import { BIZ_CODE, LITE_PHONE_REGEX, EMAIL_REGEX } from '../common/constants';

export default class SysPassportController extends Controller {
  logout() {
    this.ctx.logout();
    this.ctx.success();
    this.ctx.session = null;
  }

  /**
   * 登录验证
   */
  async login() {
    const {
      body: { username, password, challenge, validate, seccode },
    } = this.ctx.validateReq('passport.login');

    const geetestConfig: any = await this.service.sys.config.getConfigByName(
      'geetest',
    );

    // 如果开启了极验功能，则登录需要极验验证
    if (geetestConfig && geetestConfig.enable.value === 'true') {
      if (!challenge || !validate || !seccode) {
        return this.ctx.failure();
      }

      const {
        id: { value: geetestID },
        key: { value: geetestKEY },
      } = geetestConfig;

      const result = await this.service.sys.geetest.validate(
        geetestID,
        geetestKEY,
        challenge,
        validate,
        seccode,
      );

      if (!result) {
        return this.ctx.failure();
      }
    }

    const data = {
      account: username,
      password: this.ctx.helper.md5(
        `${this.ctx.app.config.saltPassword}${password}`,
      ),
    };

    const userDoc = await this.ctx.model.AuthUser.findOne({
      account: username,
    });
    // 用户名错误
    if (!userDoc) return this.ctx.failure({ code: 10003 });

    const lockVerifyRst = this.service.sys.passport.accountLockVerify(userDoc);
    if (lockVerifyRst.code) {
      return this.ctx.failure(lockVerifyRst);
    }

    const limitVerifyRst = await this.service.sys.passport.accountPswErrorLimitVerify(
      data.account,
      data.password,
    );

    if (limitVerifyRst.code) {
      return this.ctx.failure(limitVerifyRst);
    }

    const { twoFA } = userDoc;

    // 二次验证
    this.ctx.session.userId = userDoc._id;
    this.ctx.session.loginStep = 1;
    if (twoFA.email || twoFA.sms || twoFA.ga) {
      return this.ctx.failure({ code: 10024, data: { twoFA: userDoc.twoFA } });
    }

    // 未开启二次验证则直接登录
    await this.service.sys.passport.login({
      name: userDoc.name,
      id: userDoc.id,
    });

    return this.ctx.success({
      data: {
        id: userDoc.id,
        userName: userDoc.name,
      },
    });
  }

  async twoFALogin() {
    const { body } = this.ctx.validateReq('passport.2faLogin');
    const { bizCode, token } = body;

    if (this.ctx.session.loginStep !== 1) {
      return this.ctx.failure({ code: 10004 });
    }

    const innerBizCode = BIZ_CODE.LOGIN;

    if (innerBizCode !== bizCode) {
      return this.ctx.failure({ code: 10028 });
    }

    const { status, result } = await this.service.securityPlatform.auth(
      token,
      bizCode,
    );
    if (status) {
      const { userId } = this.ctx.session;
      if (!userId) {
        return this.ctx.failure({ code: 10004 });
      }

      const userDoc = await this.service.auth.user.getUserById(userId);
      if (!userDoc) return this.ctx.failure({ code: 10004 });

      await this.service.sys.passport.login({
        name: userDoc.name,
        id: userDoc.id,
      });
      this.ctx.session.loginStep = 0;

      return this.ctx.success({
        data: {
          id: userDoc.id,
          userName: userDoc.name,
          twoFA: result,
        },
      });
    } else {
      this.ctx.failure({ code: 10026 });
    }
  }

  /**
   * 重置密码
   */
  async resetPassword() {
    const {
      body: { password, passwordConfirm, token, bizCode },
    } = this.ctx.validateReq('passport.resetPassword');

    if (password !== passwordConfirm) {
      // 两次密码不一致
      return this.ctx.failure({ code: 10017 });
    }

    // 获取一下用户的验证类型，防止用户捏造
    const { userId, fgpInputType } = this.ctx.session || {};

    this.app.logger.debug('resetPassword / from session: ', {
      userId,
      fgpInputType,
    });

    let innerBizCode = `${fgpInputType.toUpperCase()}:FGP`;

    this.app.logger.debug('resetPassword / innerBizCode: ', { innerBizCode });

    const userDoc = await this.ctx.model.AuthUser.findOne({
      _id: userId,
    });

    if (userDoc) {
      this.app.logger.debug('resetPassword / userDoc: ', {
        user: userDoc.toObject(),
      });
      // 判断用户二次验证状态
      const { sms, email, ga } = userDoc.twoFA;
      if (sms || email || ga) {
        innerBizCode = BIZ_CODE.FORGOT_PASSWORD_2FA;
      }
    } else {
      return this.ctx.failure({ code: 10003 });
    }

    if (innerBizCode !== bizCode) {
      return this.ctx.failure({ code: 10028 });
    }

    const { status, result } = await this.service.securityPlatform.auth(
      token,
      bizCode,
    );

    this.app.logger.debug('Request/resetPassword, auth:', { status, result });

    if (status) {
      this.app.logger.debug('开始更新密码 / session.userId', { userId });
      const { config } = this.ctx.app;
      await this.ctx.model.AuthUser.update(
        { _id: userId },
        {
          $set: {
            password: this.ctx.helper.md5(`${config.saltPassword}${password}`),
          },
        },
      );
      return this.ctx.success();
    }

    // Token 无效
    return this.ctx.failure({ code: 10026 });
  }

  /**
   * 找回密码的验证方式
   */
  async passwordResetMethod() {
    const {
      query: { account },
    } = this.ctx.validateReq('passport.passwordResetMethod');

    this.app.logger.debug('Request/PasswordResetMethod, account:', account);

    // 判断传入参数的类型，可能是 邮箱 或 手机号码
    let userDoc;
    let method = 'contact';

    if (
      // 账户类型是 手机号码
      LITE_PHONE_REGEX.exec(account)
    ) {
      userDoc = await this.ctx.model.AuthUser.findOne({
        mobile: account,
      });
      method = 'sms';
    } else if (
      // 账户类型是 邮箱
      EMAIL_REGEX.exec(account)
    ) {
      userDoc = await this.ctx.model.AuthUser.findOne({
        email: account,
      });
      method = 'email';
    } else {
      // 请求参数错误
      return this.ctx.failure({ code: 20001 });
    }

    // 将用户的输入类型通过 SESSION 保存
    this.ctx.session.fgpInputType = method;

    // 未找到用户
    if (!userDoc) return this.ctx.failure({ code: 10003 });

    // 判断用户二次验证状态
    const { sms, email, ga } = userDoc.twoFA || {};
    if (sms || email || ga) {
      method = '2FA';
    }

    // 将用户的 ID 通过 SESSION 保存
    this.ctx.session.userId = userDoc._id;

    return this.ctx.success({
      data: {
        method,
        twoFAItems: Object.keys(userDoc.twoFA.toObject()).filter(
          k => userDoc.twoFA[k],
        ),
      },
    });
  }

  async register() {
    const {
      body: { username, password },
    } = this.ctx.validateReq('passport.register');

    const user = await this.ctx.service.auth.user.findOne(username);
    if (user) {
      return this.ctx.failure({ code: 10002, data: { username } });
    }

    const result = await this.ctx.service.auth.user.create({
      account: username,
      password,
    });
    if (!result) {
      return this.ctx.failure({ code: 20002, data: { username } });
    }
    this.ctx.success({ data: result });
  }

  ping() {
    this.ctx.success();
  }
}
