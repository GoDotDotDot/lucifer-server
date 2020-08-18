import { Application } from 'egg';
import * as paginate from 'mongoose-paginate';
import { get as lodashGet, isPlainObject, set as lodashSet } from 'lodash';
import customEnv from './config/custom-environment-variables';

class AppBootHook {
  app: Application;

  constructor(app) {
    this.app = app;
  }

  /**
   * 将嵌套的对象展开
   *
   * 假设入参的对象为：{ 'a': 1, 'b': { c: 2 } }
   * 返回的结果为 { 'a': 1, 'b.c': 2 }
   *
   * @param preObject 要展开的对象
   */
  flatNestedObject(preObject: Record<string, any>) {
    const result = {};

    // 递归遍历对象中的每一个叶子节点
    const recursiveAllValue = (
      objectToView: Record<string, any>,
      preKey = '',
    ) => {
      Object.keys(objectToView).forEach((key: string) => {
        const currentKey = preKey ? `${preKey}.${key}` : key;
        const currentValue = objectToView[key];
        if (isPlainObject(currentValue)) {
          recursiveAllValue(currentValue, key);
        } else {
          result[currentKey] = currentValue;
        }
      });
    };

    recursiveAllValue(preObject);
    return result;
  }

  configWillLoad() {
    if (customEnv && isPlainObject(customEnv)) {
      const flatCustomEnv = this.flatNestedObject(customEnv);
      Object.keys(flatCustomEnv).forEach(key => {
        const envKey = flatCustomEnv[key];
        if (
          lodashGet(this.app.config, key) !== undefined &&
          process.env[envKey] !== undefined
        ) {
          lodashSet(this.app.config, key, process.env[envKey]);
        }
      });
    }
  }

  handlePassport() {
    this.app.passport.serializeUser((ctx, user) => {
      return {
        id: ctx.helper.encrypt(user.id, ctx.app.config.sessionSecret),
      };
    });

    this.app.passport.deserializeUser((ctx, user) => {
      const uid = ctx.helper.decrypt(user.id, ctx.app.config.sessionSecret);
      return ctx.service.user.deserializeUser(uid);
    });
  }

  // 插件启动完毕
  willReady() {
    this.handlePassport();
  }

  configDidLoad() {
    // Config, plugin files have been loaded.
    const mongoose = this.app.mongoose;
    mongoose.plugin(paginate);
  }
}

export default AppBootHook;
