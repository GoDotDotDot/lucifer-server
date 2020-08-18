// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import 'egg-onerror';
import '@mete-work/egg-koa-session-auth';
import 'egg-i18n';
import 'egg-watcher';
import 'egg-multipart';
import 'egg-security';
import 'egg-development';
import 'egg-logrotator';
import 'egg-schedule';
import 'egg-static';
import 'egg-jsonp';
import 'egg-view';
import 'egg-mongoose';
import 'egg-passport';
import 'egg-redis';
import 'egg-session-redis';
import '@mete-work/egg-swagger';
import '@mete-work/egg-minio';
import { EggPluginItem } from 'egg';
declare module 'egg' {
  interface EggPlugin {
    onerror?: EggPluginItem;
    session?: EggPluginItem;
    i18n?: EggPluginItem;
    watcher?: EggPluginItem;
    multipart?: EggPluginItem;
    security?: EggPluginItem;
    development?: EggPluginItem;
    logrotator?: EggPluginItem;
    schedule?: EggPluginItem;
    static?: EggPluginItem;
    jsonp?: EggPluginItem;
    view?: EggPluginItem;
    mongoose?: EggPluginItem;
    passport?: EggPluginItem;
    redis?: EggPluginItem;
    sessionRedis?: EggPluginItem;
    swagger?: EggPluginItem;
    minio?: EggPluginItem;
  }
}