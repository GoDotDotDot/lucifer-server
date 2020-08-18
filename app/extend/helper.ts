import * as crypto from 'crypto';

const CRYPTO_ALGORITHM = 'aes-256-ctr';
const CRYPTO_IV_PREFIX = 'IV;';

const errorCode = {
  10001: '用户名或密码错误',
  10002: '用户名已存在',
  10003: '未找到该用户',
  10004: '未登录',
  10005: '用户权限不足',
  10006: '组名已存在',
  10007: '未找到用户组',
  10008: '该模块 uri 已存在',
  10009: '该模块不存在',
  10010: '该模块存在子模块，无法删除',
  10011: '二次验证无效',
  10012: '验证码错误',
  10013: '谷歌验证未开启',
  10014: '密钥已失效，请重新获取',
  10015: '密码设置失败',
  10016: '原密码错误',
  10017: '新密码与旧密码不能一致',
  10018: '该账户已被锁定',
  10019: '密码错误',
  10020: '密码错误次数已达上限',
  10021: '谷歌认证验证码错误',
  10022: '不能删除用户自己',
  10023: '不能删除自己所在的用户组',
  10024: '已开启双重校验',
  10025: '验证码发送失败',
  10026: '安全平台 token 无效',
  10027: '邮箱配置无效',
  10028: '安全平台业务码错误',
  10029: '开启认证失败',
  10030: '配置失败',
  10031: '配置谷歌认证失败',
  10032: '该手机号已被注册',
  10033: '该邮箱已被注册',
  10034: '短信发送失败',
  10035: '邮件发送失败',

  20001: '请求参数错误',
  20002: '服务器错误',
  20003: '客户端权限不足',

  30001: '该文件已存在',
  30002: '该文件不存在',
  30003: '版本号必须大于当前最新版本',

  60001: '邮箱配置不正确，验证失败！',
  60002: '手机配置不正确，验证失败！',

  70000: 'RPC 远程调用异常',

  80000: '消息通知获取失败',
  80001: '消息通知标记已读失败',
  80002: '获取消息统计数据失败',
  80003: '删除消息失败',
};

const errorMsg = (code = 0): string =>
  code === 0 ? '' : errorCode[code] || errorCode[20002];

const encrypt = (text: string, secret: string): string => {
  const key = crypto
    .createHash('sha256')
    .update(secret)
    .digest();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(CRYPTO_ALGORITHM, key, iv);
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return CRYPTO_IV_PREFIX + iv.toString('hex') + crypted;
};

const decrypt = (text: string, secret: string): string => {
  const key = crypto
    .createHash('sha256')
    .update(secret)
    .digest();
  const ivDataBuffer = Buffer.from(text.slice(CRYPTO_IV_PREFIX.length), 'hex');
  const iv = ivDataBuffer.slice(0, 16);
  const decipher = crypto.createDecipheriv(CRYPTO_ALGORITHM, key, iv);
  let dec = decipher.update(ivDataBuffer.slice(16), 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
};

const md5 = (text: string): string => {
  return crypto
    .createHash('md5')
    .update(text)
    .digest('hex');
};

function aesEncrypt(data: string, key: string) {
  const cipher = crypto.createCipher('aes192', key);
  let crypted = cipher.update(data, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

function aesDecrypt(encrypted: string, key: string) {
  const decipher = crypto.createDecipher('aes192', key);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export default {
  errorMsg,
  errorCode,
  encrypt,
  decrypt,
  md5,
  aesEncrypt,
  aesDecrypt,
};
