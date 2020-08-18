/* eslint-disable @typescript-eslint/camelcase */
import Service from '@core/baseService';
import * as Geetest from 'gt3-sdk';

interface GeetestRegisterData {
  client_type: string;
  ip_address: string;
}

export default class GeeTestService extends Service {
  async register(id: string, key: string, data?: GeetestRegisterData) {
    const instance = new Geetest({
      geetest_id: id,
      geetest_key: key,
    });

    const result = await instance.register(data);

    return result;
  }

  validate(
    id: string,
    key: string,
    challenge: string,
    validate: string,
    seccode: string,
  ) {
    const instance = new Geetest({
      geetest_id: id,
      geetest_key: key,
    });

    return instance.validate(false, {
      geetest_challenge: challenge,
      geetest_validate: validate,
      geetest_seccode: seccode,
    });
  }
}
