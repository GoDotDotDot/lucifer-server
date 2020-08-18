// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAuthGroup from '../../../app/model/auth_group';
import ExportAuthModule from '../../../app/model/auth_module';
import ExportAuthUser from '../../../app/model/auth_user';
import ExportMaterial from '../../../app/model/material';
import ExportSysConfig from '../../../app/model/sys_config';
import ExportSysConfigAttr from '../../../app/model/sys_config_attr';

declare module 'egg' {
  interface IModel {
    AuthGroup: ReturnType<typeof ExportAuthGroup>;
    AuthModule: ReturnType<typeof ExportAuthModule>;
    AuthUser: ReturnType<typeof ExportAuthUser>;
    Material: ReturnType<typeof ExportMaterial>;
    SysConfig: ReturnType<typeof ExportSysConfig>;
    SysConfigAttr: ReturnType<typeof ExportSysConfigAttr>;
  }
}
