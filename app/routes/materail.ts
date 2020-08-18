import { Application } from 'egg';
import { downloadRule, listRule, infoRule } from '@validate/material';
/**
 * 用户相关的路由
 */
export default (app: Application) => {
  return {
    'material.upload': {
      method: 'POST',
      path: '/api/material/upload',
      options: {
        tags: ['material'],
        description: '物料上传',
        handler: app.controller.material.updload,
      },
    },
    'material.download': {
      method: 'GET',
      path: '/api/material/download/:name/:fileName',
      options: {
        tags: ['material'],
        description: '物料下载',
        validate: downloadRule,
        handler: app.controller.material.download,
      },
    },
    'material.list': {
      method: 'GET',
      path: '/api/material/list',
      options: {
        tags: ['material'],
        description: '物料列表',
        validate: listRule,
        handler: app.controller.material.list,
      },
    },
    'material.info': {
      method: 'GET',
      path: '/api/material/info',
      options: {
        tags: ['material'],
        description: '物料信息',
        validate: infoRule,
        handler: app.controller.material.getMaterialInfo,
      },
    },
  };
};
