// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAuthGroup from '../../../app/routes/authGroup';
import ExportAuthModule from '../../../app/routes/authModule';
import ExportAuthUser from '../../../app/routes/authUser';
import ExportMaterail from '../../../app/routes/materail';
import ExportPassport from '../../../app/routes/passport';
import ExportSecurityPlatform from '../../../app/routes/security-platform';
import ExportSys from '../../../app/routes/sys';
import ExportUser from '../../../app/routes/user';
import ExportWebhook from '../../../app/routes/webhook';
declare module 'egg' {
  interface IRoutes {
    AuthGroup: ReturnType<typeof ExportAuthGroup>;
    AuthModule: ReturnType<typeof ExportAuthModule>;
    AuthUser: ReturnType<typeof ExportAuthUser>;
    Materail: ReturnType<typeof ExportMaterail>;
    Passport: ReturnType<typeof ExportPassport>;
    SecurityPlatform: ReturnType<typeof ExportSecurityPlatform>;
    Sys: ReturnType<typeof ExportSys>;
    User: ReturnType<typeof ExportUser>;
    Webhook: ReturnType<typeof ExportWebhook>;
  }
  type IRoutesCombine = IRoutes['AuthGroup'] & IRoutes['AuthModule'] & IRoutes['AuthUser'] & IRoutes['Materail'] & IRoutes['Passport'] & IRoutes['SecurityPlatform'] & IRoutes['Sys'] & IRoutes['User'] & IRoutes['Webhook'];
}