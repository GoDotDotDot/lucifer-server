import 'tsconfig-paths/register';
import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  session: {
    enable: true,
    package: '@mete-work/egg-koa-session-auth',
  },
  mongoose: {
    enable: true,
    package: 'egg-mongoose',
  },
  passport: {
    enable: true,
    package: 'egg-passport',
  },
  redis: {
    enable: true,
    package: 'egg-redis',
  },
  sessionRedis: {
    enable: true,
    package: 'egg-session-redis',
  },
  swagger: {
    enable: true,
    package: '@mete-work/egg-swagger',
  },
  minio: {
    enable: true,
    package: '@mete-work/egg-minio',
  },
};

export default plugin;
