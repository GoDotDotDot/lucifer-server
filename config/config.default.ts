import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import * as path from 'path';

export default (appInfo: EggAppInfo) => {
  const config: PowerPartial<EggAppConfig> = {
    keys: `${appInfo.name}_1559789626990_3221`,
    sessionSecret: 'hLrp5i2NeWfTqDYV',
    saltPassword: '4SPN3UfzwE6Dkyhh',
    authenticatorKey: 'iFUCgBHoWj0ZUR6w',
    middleware: [],
    security: {
      csrf: {
        enable: false,
      },
    },
    scheduleLogger: {
      // consoleLevel: 'NONE',
      // file: path.join(appInfo.root, 'logs', appInfo.name, 'egg-schedule.log'),
    },
    current: 1,
    pageSize: 20,
    skipAuthentication: false,
    session: {
      key: 'EGG_SESS',
      maxAge: 2 * 3600 * 1000, // 2 小时
      httpOnly: true,
      renew: true,
    },
    sessionRedis: {
      name: 'session',
    },
    // 前置代理模式，如经过链路转发请开启
    proxy: true,
    // 链路转发长度，为了防止 IP 伪造请配置好
    maxIpsCount: 1,
    multipart: {
      whitelist: filename => Boolean(path.extname(filename)),
      mode: 'stream',
    },
  };
  return config;
};
