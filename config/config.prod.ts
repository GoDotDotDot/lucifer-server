import { EggAppConfig, PowerPartial } from 'egg';

const mongooseUrl =
  'mongodb://' +
  process.env.MONGODB_USERNAME +
  ':' +
  process.env.MONGODB_PASSWORD +
  '@' +
  process.env.MONGODB_HOST +
  ':' +
  (process.env.MONGODB_PORT || '27017') +
  '/lucifer?authSource=admin';

export default () => {
  const config: PowerPartial<EggAppConfig> = {
    skipAuthentication: false,
  };

  config.auditLog = {
    mongoose: {
      url: mongooseUrl,
      options: {
        autoReconnect: true,
      },
    },
  };

  config.redis = {
    clients: {
      session: {
        host: process.env.REDIS_HOST,
        port: 6379,
        password: process.env.REDIS_PASSWORD,
        db: 0,
      },
      schedule: {
        host: process.env.REDIS_HOST,
        port: 6379,
        password: process.env.REDIS_PASSWORD,
        db: 0,
      },
      config: {
        host: process.env.REDIS_HOST,
        port: 6379,
        password: process.env.REDIS_PASSWORD,
        db: 0,
      },
      securityPlatform: {
        host: process.env.REDIS_HOST,
        port: 6379,
        password: process.env.REDIS_PASSWORD,
        db: 1,
      },
    },
  };

  config.mongoose = {
    url: mongooseUrl,
    options: {
      autoReconnect: true,
    },
  };

  config.accountLock = {
    count: 5,
    lockTime: 24 * 3600 * 1000,
  };

  config.nodemailer = {
    client: {
      host: 'smtp.exmail.qq.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'noreply@example.com', // generated ethereal user
        pass: 'EiTBWqVGPkYPGQbf', // generated ethereal password
      },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      },
    },
  };

  config.mapping = {
    '.ejs': 'ejs',
  };

  config.securityPlatform = {
    // 过期时间，单位：秒
    verifyCodeExpire: 5 * 60,
  };

  config.minio = {
    client: {
      endPoint: process.env.MINIO_ENDPOINT,
      accessKey: process.env.MINIO_USERNAME,
      secretKey: process.env.MINIO_PASSWORD,
      useSSL: false,
      port: 80,
    },
  };

  return config;
};
