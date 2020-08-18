/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller } from 'egg';

export default class SysConfigController extends Controller {
  /**
   * 根据路由路径确定配置项名称
   * @param routerPath
   */
  _getConfigName(routerPath: string) {
    const regex = /.*\/([\w-_]+)$/;
    const result = regex.exec(routerPath);
    return result ? result[1] : '';
  }

  async getInfo() {
    const name = this._getConfigName(this.ctx.routerPath);
    const result = await this.ctx.service.sys.config.getConfigByName(name);
    if (!result) {
      this.ctx.failure({
        code: 10009,
        data: {
          name,
        },
      });
      return false;
    }

    this.ctx.success({ data: result });
  }

  async update() {
    const name = this._getConfigName(this.ctx.routerPath);
    const query = this.ctx.request.body;
    const result = await this.ctx.service.sys.config.update(name, query);
    if (!result) {
      this.ctx.failure({
        code: 10009,
        data: {
          name,
        },
      });
      return false;
    }
    this.ctx.success({ data: result });
  }

  healthCheck() {
    this.ctx.success();
  }
}
