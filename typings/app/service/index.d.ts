// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportMaterial from '../../../app/service/material';
import ExportSecurityPlatform from '../../../app/service/security-platform';
import ExportUser from '../../../app/service/user';
import ExportAuthGroup from '../../../app/service/auth/group';
import ExportAuthModule from '../../../app/service/auth/module';
import ExportAuthUser from '../../../app/service/auth/user';
import ExportSysConfig from '../../../app/service/sys/config';
import ExportSysGeetest from '../../../app/service/sys/geetest';
import ExportSysPassport from '../../../app/service/sys/passport';
import ExportWebhookGitlab from '../../../app/service/webhook/gitlab';

declare module 'egg' {
  interface IService {
    material: AutoInstanceType<typeof ExportMaterial>;
    securityPlatform: AutoInstanceType<typeof ExportSecurityPlatform>;
    user: AutoInstanceType<typeof ExportUser>;
    auth: {
      group: AutoInstanceType<typeof ExportAuthGroup>;
      module: AutoInstanceType<typeof ExportAuthModule>;
      user: AutoInstanceType<typeof ExportAuthUser>;
    }
    sys: {
      config: AutoInstanceType<typeof ExportSysConfig>;
      geetest: AutoInstanceType<typeof ExportSysGeetest>;
      passport: AutoInstanceType<typeof ExportSysPassport>;
    }
    webhook: {
      gitlab: AutoInstanceType<typeof ExportWebhookGitlab>;
    }
  }
}
