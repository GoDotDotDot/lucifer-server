// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportMaterial from '../../../app/controller/material';
import ExportPassport from '../../../app/controller/passport';
import ExportSecurityPlatform from '../../../app/controller/security-platform';
import ExportSys from '../../../app/controller/sys';
import ExportUser from '../../../app/controller/user';
import ExportAuthGroup from '../../../app/controller/auth/group';
import ExportAuthModule from '../../../app/controller/auth/module';
import ExportAuthUser from '../../../app/controller/auth/user';
import ExportWebhookGitlab from '../../../app/controller/webhook/gitlab';

declare module 'egg' {
  interface IController {
    material: ExportMaterial;
    passport: ExportPassport;
    securityPlatform: ExportSecurityPlatform;
    sys: ExportSys;
    user: ExportUser;
    auth: {
      group: ExportAuthGroup;
      module: ExportAuthModule;
      user: ExportAuthUser;
    }
    webhook: {
      gitlab: ExportWebhookGitlab;
    }
  }
}
