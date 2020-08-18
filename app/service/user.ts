// 目前提供用户权限 rbac 相关
import { Service } from 'egg';

interface LuciferUser {
  id: string;
  username: string;
}

export default class RbacService extends Service {
  async deserializeUser(uid: string): Promise<LuciferUser | null> {
    const userInfo = await this.ctx.model.AuthUser.findById(uid);

    if (userInfo) {
      return {
        id: userInfo.id,
        username: userInfo.account,
      };
    }
    return null;
  }

  /**
   * 判断用户是否有 rule 的权限
   * @param rule RBAC 规则
   */
  async can(rule: string): Promise<boolean> {
    const uid = this.ctx.user.id;
    return this.userCan(uid, rule);
  }

  /**
   *
   * @param uid 用户 objectId
   * @param rule
   */
  async userCan(uid: string, rule: string): Promise<boolean> {
    if (!uid) {
      return false;
    }
    const group = await this.ctx.model.AuthGroup.findOne({
      users: uid,
      modules: rule,
    });
    return !!group;
  }

  /**
   *
   * @param uid 用户 objectId
   * @param password  新密码
   */
  setPassword(uid: string, password: string) {
    const { config } = this.ctx.app;
    return this.ctx.model.AuthUser.findByIdAndUpdate(uid, {
      password: this.ctx.helper.md5(`${config.saltPassword}${password}`),
    });
  }
}
