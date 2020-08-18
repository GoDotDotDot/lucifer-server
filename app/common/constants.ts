// 密码设置二次验证数据在redis的缓存路径
export const REDIS_AUTHENTICATOR_VERIFY_SET_PASSWORD = 'verify:setPassword';
// 登录二次验证数据在redis的缓存路径
export const REDIS_AUTHENTICATOR_VERIFY_LOGIN = 'verify:login';
// 开启谷歌验证的密钥在redis的缓存路径
export const REDIS_AUTHENTICATOR_SECRET = 'secret';

// 密码校验规则: 密码需要由8-16个字符（必须包含字母、数字、特殊字符）组成
/* eslint-disable-next-line no-useless-escape */
export const PASSWORD_REGEX = /^(?=.*\d)(?=.*[A-Za-z])(?=.*[~`!@#$%^&*_'";:><,\|\?\.\-\+\=\[\]\(\)\{\}\/])([\w~`!@#$%^&*_'";:><,\|\?\.\-\+\=\[\]\(\)\{\}\/]{8,16})$/;

export const LITE_PHONE_REGEX = /^[\d|(|)|+\s-]{0,20}$/;
export const EMAIL_REGEX = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;
export const LITE_PHONE_OR_EMAIL_REGEX = /^[\d|(|)|+\s-]{0,20}$|^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;

export enum BIZ_CODE {
  LOGIN = '2FA:LOGIN',
  FORGOT_PASSWORD_2FA = '2FA:FGP',
  FORGOT_PASSWORD_SMS = 'SMS:FGP',
  FORGOT_PASSWORD_EMAIL = 'EMAIL:FGP',
  BIND_GA = 'GA:BIND_GA',
  BIND_MOBILE = 'SMS:BIND_MOBILE',
  BIND_EMAIL = 'EMAIL:BIND_EMAIL',
  ENABLE_SMS_AUTH = 'SMS:ENABLE_SMS_AUTH',
  DISABLE_SMS_AUTH = '2FA:DISABLE_SMS_AUTH',
  ENABLE_EMAIL_AUTH = 'EMAIL:ENABLE_EMAIL_AUTH',
  DISABLE_EMAIL_AUTH = '2FA:DISABLE_EMAIL_AUTH',
  EDIT_BIND_MOBILE = 'SMS:EDIT_BIND_MOBILE',
  SMS_EDIT_STEP_ONE = 'SMS:SMS_EDIT_STEP_ONE',
  EDIT_BIND_EMAIL = 'EMAIL:EDIT_BIND_EMAIL',
  EMAIL_EDIT_STEP_ONE = 'EMAIL:EMAIL_EDIT_STEP_ONE',
  GA_EDIT_STEP_ONE = 'GA:GA_EDIT_STEP_ONE',
  EDIT_BIND_GA = 'GA:EDIT_BIND_GA',
  ENABLE_GA_AUTH = 'GA:ENABLE_GA_AUTH',
  DISABLE_GA_AUTH = '2FA:DISABLE_GA_AUTH',
  UPDATE_PASSWORD = '2FA:UPDATE_PASSWORD',
}

export const BUCKET_NAME = 'material';
