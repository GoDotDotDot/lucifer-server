const path = require('path');

/**
 * 这是一个 egg-ts-helper 的配置文件，用于自动生成路由的 TypeScript 定义文件
 */
module.exports = {
  watchDirs: {
    routes: {
      directory: 'app/routes',
      enabled: true,
      generator: function(config) {
        const fileList = config.fileList;
        const dist = path.resolve(config.dtsDir, 'index.d.ts');

        const ins = [];
        const outs = [];
        const combine = [];

        fileList.forEach(f => {
          const abUrl = path.resolve(config.dir, f);
          const relativePath = path.relative(config.dtsDir, abUrl);
          const modulePath = relativePath.replace(/\.ts$/, '');
          const { moduleName } = this.helper.utils.getModuleObjByPath(f);
          ins.push(`import Export${moduleName} from '${modulePath}';`);
          outs.push(
            `    ${moduleName}: ReturnType<typeof Export${moduleName}>;`,
          );
          combine.push(`IRoutes['${moduleName}']`);
        });

        return {
          dist,
          content: `${ins.join('\n')}
declare module 'egg' {
  interface IRoutes {
${outs.join('\n')}
  }
  type IRoutesCombine = ${combine.length > 0 ? combine.join(' & ') : 'any'};
}`,
        };
      },
    },
  },
};
