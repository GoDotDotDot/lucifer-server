import Service from '@core/baseService';
import * as uuid from 'uuid/v1';
import { AuthUserSchema } from 'model/auth_user';
import { NodeMailerOptions } from '@mete-work/egg-nodemailer';
import { authenticator } from 'otplib';
import { BIZ_CODE } from 'common/constants';

const REDIS_CLIENT = 'securityPlatform';

interface VerifyCode {
  email?: string;
  ga?: string;
}

interface EmailConfig {
  emailHost?: string;
  emailPort?: number;
  emailUsername?: string;
  emailPassword?: string;
  emailFrom?: string;
  emailTitle?: string;
  emailTo?: string;
}

export default class SecurityPlatform extends Service {
  private parseBoolStr(str = '') {
    const boolStr = str.toLowerCase();
    if (!['false', 'true'].find(item => item === boolStr)) {
      return false;
    }

    try {
      return JSON.parse(boolStr);
    } catch (error) {
      return false;
    }
  }

  private async getSkipSwitch(type: 'sms' | 'email' | 'ga') {
    // 如果界面上配置了跳过，则跳过
    const dbConfig =
      (await this.service.sys.config.getPlainConfigByName('2fa')) || {};
    const configStr = `${type}Skip`;
    this.app.logger.debug('二次验证数据库配置项：', { dbConfig, configStr });
    if (this.parseBoolStr(dbConfig[configStr])) return true;

    // 如果界面上没有配置跳过，但是环境变量里配置了跳过，则跳过
    const envStr = `SKIP_SEND_${type.toUpperCase()}`;
    const envConfig = process.env[envStr];
    this.app.logger.debug('二次验证环境变量配置项：', { envConfig, envStr });
    return this.parseBoolStr(envConfig || '');
  }

  private getRedis(clientName?: string) {
    if (clientName) {
      return this.app.redis.get(clientName);
    }
    if (this.app.config.redis.client) {
      return this.app.redis;
    }
  }

  private getRedisKey(userId: string, biz: string) {
    return `VerifyCode:${userId}-${biz}`;
  }

  private async getVerifyCodeText(code: string) {
    let tpl = '您的验证码是 #code#';
    const tfaConfig: any = await this.service.sys.config.getPlainConfigByName(
      '2fa',
    );
    if (tfaConfig && tfaConfig.codeTemplate) tpl = tfaConfig.codeTemplate;
    return tpl.replace('#code#', code);
  }

  /**
   * 或者验证码结果，判断是否正确
   * @param biz 业务编码
   * @param verifyCode 输入端验证码
   */
  async getVerifyCodeResult(
    biz,
    items: string[],
    verifyCode: VerifyCode,
    userId,
  ) {
    const redis = this.getRedis(REDIS_CLIENT);
    const key = this.getRedisKey(userId, biz);
    const encryptCodes = await redis?.get(key);

    const codes = JSON.parse(encryptCodes || '{}');

    let user;
    // 谷歌验证需要从用户表中拿秘钥
    if (items.includes('ga')) {
      user = await this.service.auth.user.getUserById(userId);
    }

    return items.reduce((acc, cur) => {
      if (cur === 'ga') {
        const secret = this.ctx.helper.aesDecrypt(
          user.ga,
          this.app.config.authenticatorKey,
        );
        const gaIsValid = authenticator.check(
          verifyCode[cur] as string,
          secret,
        );
        return Object.assign(acc, {
          ga: gaIsValid,
        });
      }

      return Object.assign(acc, {
        [cur]: codes[cur]
          ? verifyCode[cur] === this.ctx.helper.decrypt(codes[cur], userId)
          : false,
      });
    }, {});
  }

  /**
   * 校验 token 是否有效
   * @param token token
   * @param bizCode 业务编码
   */
  async auth(token, bizCode) {
    const redis = this.getRedis(REDIS_CLIENT);
    const resultStr = await redis?.get(token);

    if (!resultStr) {
      return { status: false };
    }

    // 清除键
    await redis?.del(token);
    const result = JSON.parse(resultStr);
    if (result.bizCode === bizCode) return { status: true, result };
    return { status: false };
  }

  async verify(bizCode: string, code: VerifyCode = {}, userId) {
    const [verifyType] = bizCode.split(':');
    const lowerCaseVerifyType = verifyType.toLowerCase();

    const user: AuthUserSchema = await this.service.auth.user.getUserById(
      userId,
    );

    if (!user) throw Error(`10003: ${this.ctx.helper.errorMsg(10003)}`);

    const uuidToken: string = uuid();
    const token = uuidToken.replace(/-/g, '');

    let response: {
      token: string;
      result: { [key: string]: any };
      bizCode: string;
    };

    switch (lowerCaseVerifyType) {
      case '2fa': {
        const { twoFA } = user.toJSON();
        const items = Object.keys(twoFA).filter(item => twoFA[item]);

        const twoFAResult = await this.getVerifyCodeResult(
          bizCode,
          items,
          code,
          userId,
        );

        response = {
          token,
          result: twoFAResult,
          bizCode,
        };
        break;
      }
      case 'ga': {
        let encryptedSecret;
        // 谷歌验证需要做特殊处理
        // 如果是绑定和修改绑定则需要在 redis 中拿 encryptedSecret
        // 否则在 auth_user 表中获取 ga 字段
        if (bizCode === BIZ_CODE.BIND_GA || bizCode === BIZ_CODE.EDIT_BIND_GA) {
          const gaKey = this.getRedisKey(userId, bizCode);
          const gaRedis = this.getRedis(REDIS_CLIENT);
          encryptedSecret = await gaRedis?.get(gaKey);
        } else {
          encryptedSecret = user.ga;
        }
        if (encryptedSecret) {
          const secret = this.ctx.helper.aesDecrypt(
            encryptedSecret,
            this.app.config.authenticatorKey,
          );
          const gaIsValid = authenticator.check(code.ga as string, secret);
          response = {
            token,
            bizCode,
            result: {
              ga: gaIsValid,
              encryptedSecret,
            },
          };
        } else {
          response = { token: '', result: { ga: false }, bizCode };
        }
        break;
      }
      default: {
        const otherResult = await this.getVerifyCodeResult(
          bizCode,
          [lowerCaseVerifyType],
          code,
          userId,
        );
        response = {
          token,
          result: otherResult,
          bizCode,
        };
        break;
      }
    }

    const resultValues = Object.values(response.result);
    if (resultValues.length === 0 || resultValues.includes(false)) {
      return { token: '', result: response.result, bizCode };
    }

    const redis = this.getRedis(REDIS_CLIENT);

    // 验证通过后应当清除验证码结果，以防在过期时间内重复利用
    await redis?.del(this.getRedisKey(userId, bizCode));

    await redis?.setex(
      response.token,
      this.config.securityPlatform.verifyCodeExpire,
      JSON.stringify(response),
    );

    if (response.result.encryptedSecret) {
      delete response.result.encryptedSecret;
    }

    return response;
  }

  /**
   * 发送邮件
   * @param bizCode 业务编码
   * @param userId 用户ID
   */
  async emailSend(
    bizCode: string,
    userId: string,
    email: string,
    mailOptions: NodeMailerOptions = {},
  ) {
    const key = this.getRedisKey(userId, bizCode);
    const redis = this.getRedis(REDIS_CLIENT);
    const skipSend = await this.getSkipSwitch('email');
    this.app.logger.debug('发送邮箱验证码', { key, skipSend });
    const code = this.generateRandomVerifyCode(6, skipSend);

    const emailConfig:
      | EmailConfig
      | undefined = await this.service.sys.config.getPlainConfigByName('email');

    const config =
      emailConfig && Object.values(emailConfig).filter(item => item).length
        ? {
            mailOptions: {
              from: emailConfig.emailFrom || emailConfig.emailUsername,
              subject: emailConfig.emailTitle,
              to: email || emailConfig.emailTo,
            },
            config: {
              host: emailConfig.emailHost,
              port: emailConfig.emailPort,
              secure: true, // true for 465, false for other ports
              auth: {
                user: emailConfig.emailUsername, // generated ethereal user
                pass: emailConfig.emailPassword, // generated ethereal password
              },
              tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false,
              },
            },
          }
        : {
            config: this.config.nodemailer.client,
            mailOptions: {
              from: this.config.nodemailer.client?.auth?.user,
              to: email,
            },
          };

    if (!config) {
      throw Error(`10027:${this.ctx.helper.errorMsg(10027)}`);
    }

    if (!skipSend) {
      await this.app.nodemailer.sendMail({
        mailOptions: {
          subject: '验证码', // Subject line
          text: await this.getVerifyCodeText(code),
          ...config.mailOptions,
          ...mailOptions,
        },
        config: config.config,
      });
    }

    if (redis) {
      const old = (await redis.get(key)) || '{}';
      const oldCodes = JSON.parse(old);

      const encryptCode = this.ctx.helper.encrypt(code, userId);
      const value = {
        ...oldCodes,
        email: encryptCode,
      };

      return redis.setex(
        key,
        this.config.securityPlatform.verifyCodeExpire,
        JSON.stringify(value),
      );
    }
    return Promise.reject(Error('redis 客户端异常'));
  }

  async generateGA(bizCode: string) {
    // 生成谷歌秘钥一定是在登录情况下
    const { username, id } = this.ctx.user;

    const key = this.getRedisKey(id, bizCode);
    const redis = this.getRedis(REDIS_CLIENT);

    const secret = authenticator.generateSecret();
    const encryptedSecret = this.ctx.helper.aesEncrypt(
      secret,
      this.app.config.authenticatorKey,
    );

    // 获取系统名称作为 authenticator 验证器的域
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const site: any = await this.ctx.service.sys.config.getConfigByName('site');
    const service = site ? site.siteName.value : '';
    const uri = authenticator.keyuri(username, service, secret);

    await redis?.setex(
      key,
      this.config.securityPlatform.verifyCodeExpire,
      encryptedSecret,
    );

    return { code: secret, uri };
  }

  generateRandomVerifyCode(length = 6, jump = false) {
    let code = '';
    if (jump) {
      code = '111111';
      this.app.logger.debug(`验证码：${code}`);
      return code;
    }
    function getRandomIntInclusive(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值
    }

    for (let i = 0; i < length; i++) {
      code += getRandomIntInclusive(0, 9);
    }

    this.app.logger.debug(`验证码：${code}`);
    return code;
  }
}
