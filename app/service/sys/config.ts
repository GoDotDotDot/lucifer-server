import { Redis } from 'ioredis';
import { get, map, pick, reduce } from 'lodash';
import Service from '@core/baseService';

export default class ConfigService extends Service {
  private REDIS_CONFIG_KEY = 'SYS:CONFIG';
  private REDIS_CONFIG_EXP_SEC = 60;

  private attrModel;

  constructor(ctx) {
    super(ctx);
    this.model = this.ctx.model.SysConfig;
    this.attrModel = ctx.model.SysConfigAttr;
  }

  async getPlainConfigByName(name: string) {
    let config;

    // 尝试从 Redis 内获取配置
    let redis: Redis;
    if (this.app.config.redis.client) {
      redis = this.app.redis;
    } else {
      redis = this.app.redis.get('config');
    }

    const configName = `${this.REDIS_CONFIG_KEY}:${name}`;
    const configStr = await redis.get(configName);
    if (configStr) {
      this.app.logger.debug('从 Redis 获得系统配置 (string):', configStr);
      // 获取到了的话，直接返回
      config = JSON.parse(configStr);
      this.app.logger.debug('从 Redis 获得系统配置 (json):', config);
      return config;
    }

    // 尝试从 MongoDB 获取配置
    config = await this.service.sys.config.getPlainConfigByNameFromDB(name);
    if (config) {
      this.app.logger.debug('从 MongoDB 获得系统配置 (SysConfig):', config);
      //  将短信配置放入 Redis 内
      await redis.setex(
        configName,
        this.REDIS_CONFIG_EXP_SEC,
        JSON.stringify(config),
      );
      return config;
    }
    return config;
  }

  /**
   * 根据配置名称获取配置定义及其所有配置项的原始值
   * 如：{ api_key: '42sx9dl21jasd90',  api_url: 'http://www.example.com' }
   * @param name
   */
  async getPlainConfigByNameFromDB(name: string) {
    const config = await this.getConfigByName(name);
    if (config) {
      return Object.keys(config).reduce(
        (acc, cur) => Object.assign(acc, { [cur]: config[cur].value }),
        {},
      );
    }
  }

  /**
   * 根据配置名称获取配置定义及其所有配置项的值
   * @param name
   */
  async getConfigByName(name: string) {
    const data = await this.model.findOne({ name });
    const definitions = await this.attrModel.find({ configName: name }).sort({
      order: 1,
    });

    if (definitions.length === 0) {
      this.logger.error(`No config definitions found for name ${name}.`);
      return;
    }
    const result = reduce(
      definitions,
      (ret, curr) => {
        ret[curr.field] = {
          field: curr.field,
          name: curr.name,
          type: curr.type,
          options: curr.options,
          idRequired: curr.idRequired,
          defaultValue: curr.defaultValue,
          helpText: curr.helpText,
          isOccupyOneline: curr.isOccupyOneline,
          order: curr.order,
          value: get(data, `value.${curr.field}`, null),
        };
        return ret;
      },
      {},
    );
    return result;
  }

  async update(name: string, data: object) {
    const definitions = await this.attrModel.find({ configName: name }).sort({
      order: -1,
    });

    if (definitions.length === 0) {
      this.logger.error(`No config definitions found for name ${name}.`);
      return;
    }

    const fields = map(definitions, curr => {
      return curr.field;
    });

    const result = await this.ctx.model.SysConfig.findOneAndUpdate(
      { name },
      { name, value: pick(data, fields) },
      {
        new: true,
        runValidators: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    return result;
  }
}
