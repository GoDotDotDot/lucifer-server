import Service from '@core/baseService';

export default class ConfigService extends Service {
  async login({ name, id }) {
    await this.ctx.login({ username: name, id });
    // 必须刷新 CSRF token, 参见: https://eggjs.org/zh-cn/core/security.html#%E5%88%B7%E6%96%B0-csrf-token
    this.ctx.rotateCsrfSecret();
  }

  accountLockVerify(user: any) {
    const { lockInfo } = user;
    const { lock, count, lockDate } = lockInfo;
    const { count: limitCount, lockTime } = this.config.accountLock;

    // 检测账户是否被锁定
    if (lock) {
      return { code: 10018 };
    }

    // 检测在规定时间内密码错误次数已达上限
    if (lockDate && Date.now() - lockDate < lockTime && limitCount <= count) {
      return {
        code: 10020,
        data: { unlockDate: new Date(lockTime + Number(lockDate)) },
      };
    }
    return { code: 0 };
  }

  async accountPswErrorLimitVerify(account, password) {
    const user = await this.ctx.model.AuthUser.findOne({ account });

    // 用户不存在
    if (!user) {
      return { code: 10003 };
    }
    const { lockInfo } = user;
    const { count, lockDate } = lockInfo;
    const { count: limitCount, lockTime } = this.config.accountLock;

    // 密码错误
    if (password !== user.password) {
      // 超过限制登录时间并且是第一次登录
      if (
        limitCount <= count &&
        lockDate &&
        Date.now() - lockDate.getTime() > lockTime
      ) {
        await this.ctx.model.AuthUser.updateOne(
          { account },
          {
            // eslint-disable-next-line
            // @ts-ignore
            lockInfo: {
              count: 1,
              lockDate: (Date.now() as any) as Date,
            },
          },
        );
        return { code: 10001, data: { count: 1, limitCount } };
      }
      // 未达到错误次数限制
      const resData = { count: count + 1, lockDate: new Date() };
      await this.ctx.model.AuthUser.updateOne(
        { account },
        {
          // eslint-disable-next-line
          // @ts-ignore
          lockInfo: resData,
        },
      );
      return { code: 10001, data: { count: resData.count, limitCount } };
    }
    await this.resetAccountLock(account);
    return { code: 0 };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async resetAccountLock(account, unlock = false) {
    return this.ctx.model.AuthUser.updateOne(
      { account },
      {
        lockInfo: {
          lock: unlock,
          count: 0,
          lockDate: undefined,
        },
      },
    );
  }
}
