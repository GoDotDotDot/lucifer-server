import { Controller } from 'egg';
import { BIZ_CODE } from 'common/constants';

export default class SecurityPlatformController extends Controller {
  private async toggle(
    token: string,
    bizCode: string,
    innerBizCode: string,
    type: 'ga' | 'email',
    enable = false,
  ) {
    if (bizCode !== innerBizCode) {
      return this.ctx.failure({ code: 10028 });
    }

    const { status } = await this.service.securityPlatform.auth(
      token,
      innerBizCode,
    );
    if (!status) {
      return this.ctx.failure({ code: 10026 });
    }

    // 开启邮箱验证
    const rst = await this.service.auth.user.update(this.ctx.user.id, {
      $set: { [`twoFA.${type}`]: enable },
    });
    if (!rst) {
      return this.ctx.failure({ code: 10029 });
    }

    this.ctx.success();
  }

  private async configAuthItme(
    bizCode: string,
    innerBizCode: string,
    code: string,
    type = 'email',
    value: string,
  ) {
    const userId = this.ctx.user.id;
    const field = {
      email: 'email',
    };

    const { token, result } = await this.service.securityPlatform.verify(
      bizCode,
      { [field[type]]: code },
      userId,
    );

    if (!result[field[type]]) {
      return this.ctx.failure({ code: 10012 });
    }

    const { status } = await this.service.securityPlatform.auth(
      token,
      innerBizCode,
    );
    if (status) {
      const rst = await this.service.auth.user.update(userId, {
        [type]: value,
      });
      if (!rst) {
        return this.ctx.failure({ code: 10030 });
      }
      return this.ctx.success();
    }

    this.ctx.failure({ code: 10026 });
  }

  private async editWith2StepAuth(
    tokens,
    innerBizCodes: string[],
    type: 'email',
    value,
  ) {
    const [stepOne, stepTwo] = tokens;

    if (
      stepOne.bizCode !== innerBizCodes[0] ||
      stepTwo.bizCode !== innerBizCodes[1]
    ) {
      return this.ctx.failure({ code: 10028 });
    }

    const stepOneStatus = await this.service.securityPlatform.auth(
      stepOne.token,
      innerBizCodes[0],
    );
    const stepTwoStatus = await this.service.securityPlatform.auth(
      stepTwo.token,
      innerBizCodes[1],
    );

    if (stepOneStatus.status && stepOneStatus.status) {
      if (
        await this.service.auth.user.update(this.ctx.user.id, { [type]: value })
      ) {
        return this.ctx.success();
      }
      return this.ctx.failure({ code: 10027 });
    }

    this.ctx.failure({ data: [stepOneStatus, stepTwoStatus] });
  }

  async verify() {
    const { body } = this.ctx.validateReq('securityPlatform.strategy.verify');
    const { bizCode, email, ga } = body;

    try {
      const {
        token,
        bizCode: resBizCode,
        result,
      } = await this.service.securityPlatform.verify(
        bizCode,
        { email, ga },
        this.ctx.session.userId,
      );

      const rst = Object.values(result).every(item => item);
      if (!rst) {
        return this.ctx.failure({
          code: 10012,
          data: { token, bizCode: resBizCode, result },
        });
      }

      this.ctx.success({ data: { bizCode, result, token } });
    } catch (err) {
      const code = (err.message || '').split(':')[0];
      if (!isNaN(Number(code))) {
        return this.ctx.failure({ code });
      }
      this.app.logger.error(err);
      return this.ctx.failure();
    }
  }

  async auth() {
    const { body } = this.ctx.validateReq('securityPlatform.strategy.auth');
    const { bizCode, token } = body;

    const rst = await this.service.securityPlatform.auth(token, bizCode);
    if (rst.status) {
      return this.ctx.success({ data: rst.result });
    }

    this.ctx.failure({ code: 10026 });
  }

  // 获取二次验证列表
  async twoFAList() {
    const {
      query: { account },
    } = this.ctx.validateReq('securityPlatform.strategy.list');

    const user = await this.service.auth.user.findOne(account);
    if (!user) {
      return this.ctx.failure({ code: 10003 });
    }

    this.ctx.success({ data: user.twoFA });
  }

  // 邮箱验证码发送
  async emailSend() {
    const {
      body: { bizCode, email },
    } = this.ctx.validateReq('securityPlatform.email.send');

    const userId = this.ctx.session.userId;

    const bizType = bizCode.split(':')[1] || '';
    const prefix = bizType.split('_')[0];

    let userEmail;
    // 邮箱号码来自于用户传递
    if (prefix === 'BIND' || prefix === 'EDIT') {
      if (!email) {
        return this.ctx.failure({ code: 20001 });
      }
      const user = await this.service.auth.user.getUser({ email });
      if (user) return this.ctx.failure({ code: 10033 });
      userEmail = email;
    } else {
      const user = await this.service.auth.user.getUserById(userId);
      if (!user) return this.ctx.failure({ code: 10004 });

      if (!user.email) {
        return this.ctx.failure({ code: 60001 });
      }
      userEmail = user.email;
    }

    try {
      const rst = await this.service.securityPlatform.emailSend(
        bizCode,
        userId,
        userEmail,
      );
      if (rst === 'OK') {
        return this.ctx.success();
      }
    } catch (err) {
      const code = (err.message || '').split(':')[0];
      if (!isNaN(Number(code))) {
        return this.ctx.failure({ code });
      }
      this.app.logger.error(err);
      return this.ctx.failure({ code: 10035 });
    }

    this.ctx.failure();
  }

  // 生成 ga key
  async generateGASecret() {
    const {
      query: { bizCode },
    } = this.ctx.validateReq('securityPlatform.ga.secret');
    const data = await this.service.securityPlatform.generateGA(bizCode);

    this.ctx.success({ data });
  }

  // 绑定 ga
  async bindGA() {
    const {
      body: { ga },
    } = this.ctx.validateReq('securityPlatform.ga.bind');
    const bizCode = BIZ_CODE.BIND_GA;

    const userId = this.ctx.user.id;

    const { token, result } = await this.service.securityPlatform.verify(
      bizCode,
      { ga },
      userId,
    );

    if (!result.ga) {
      return this.ctx.failure({ code: 10012 });
    }

    const {
      status,
      result: authResult,
    } = await this.service.securityPlatform.auth(token, bizCode);

    if (!status) {
      return this.ctx.failure({ code: 10026 });
    }

    if (!authResult || !authResult.result) {
      return this.ctx.failure({ code: 10031 });
    }

    const rst = await this.ctx.service.auth.user.update(userId, {
      ga: authResult.result.encryptedSecret,
    });

    if (!rst) {
      return this.ctx.failure({ code: 10031 });
    }

    this.ctx.success();
  }

  // 开启 ga
  async enableGAAuth() {
    const {
      body: { bizCode, token },
    } = this.ctx.validateReq('securityPlatform.ga.enable');

    const innerBizCode = BIZ_CODE.ENABLE_GA_AUTH;

    await this.toggle(token, bizCode, innerBizCode, 'ga', true);
  }

  // 关闭谷歌验证
  async disableGAAuth() {
    const {
      body: { bizCode, token },
    } = this.ctx.validateReq('securityPlatform.ga.disable');

    const innerBizCode = BIZ_CODE.DISABLE_GA_AUTH;

    await this.toggle(token, bizCode, innerBizCode, 'ga', false);
  }

  // // 修改谷歌验证
  async editBindGA() {
    const {
      body: { tokens },
    } = this.ctx.validateReq('securityPlatform.ga.edit');

    const stepOneBizCode = BIZ_CODE.GA_EDIT_STEP_ONE;
    const stepTwoBizCode = BIZ_CODE.EDIT_BIND_GA;

    const userId = this.ctx.user.id;

    const { status: stepOneStatus } = await this.service.securityPlatform.auth(
      tokens[0].token,
      stepOneBizCode,
    );

    if (!stepOneStatus) {
      return this.ctx.failure({ code: 10026, data: tokens[0] });
    }

    const { status, result = {} } = await this.service.securityPlatform.auth(
      tokens[1].token,
      stepTwoBizCode,
    );

    if (!status) {
      return this.ctx.failure({ code: 10026, data: tokens[1] });
    }

    const authResult = result.result;
    if (!authResult || !authResult.encryptedSecret) {
      return this.ctx.failure({ code: 10031 });
    }

    const rst = await this.ctx.service.auth.user.update(userId, {
      ga: authResult.encryptedSecret,
    });

    if (!rst) {
      return this.ctx.failure({ code: 10031 });
    }

    this.ctx.success();
  }

  // 绑定邮箱
  async bindEmail() {
    const {
      body: { bizCode, email, code },
    } = this.ctx.validateReq('securityPlatform.email.bind');

    const innerBizCode = BIZ_CODE.BIND_EMAIL;

    await this.configAuthItme(bizCode, innerBizCode, code, 'email', email);
  }
  // 修改绑定手机邮箱
  async editBindEmail() {
    const {
      body: { tokens, email },
    } = this.ctx.validateReq('securityPlatform.email.edit');

    await this.editWith2StepAuth(
      tokens,
      [BIZ_CODE.EMAIL_EDIT_STEP_ONE, BIZ_CODE.EDIT_BIND_EMAIL],
      'email',
      email,
    );
  }

  // 开启邮箱验证
  async enableEmailAuth() {
    const {
      body: { bizCode, token },
    } = this.ctx.validateReq('securityPlatform.email.enable');

    const innerBizCode = BIZ_CODE.ENABLE_EMAIL_AUTH;
    await this.toggle(token, bizCode, innerBizCode, 'email', true);
  }

  // 关闭邮箱验证
  async disableEmailAuth() {
    const {
      body: { bizCode, token },
    } = this.ctx.validateReq('securityPlatform.email.disable');

    const innerBizCode = BIZ_CODE.DISABLE_EMAIL_AUTH;

    await this.toggle(token, bizCode, innerBizCode, 'email', false);
  }
}
