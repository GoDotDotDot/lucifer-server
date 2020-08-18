export default {
  /**
   * 演示如何配置环境变量
   * 当环境变量 ENV_CONFIG_FOR_DEMO 有值的时候，将会覆盖配置文件中 envConfigForDemo 的值
   * 支持修改配置项中嵌套的值，例如一个配置项为：
   * config.envConfigNestForDemo = {
       testName: 'Tony',
     };
   * 可以通过 ENV_CONFIG_TEST_NAME 环境变量设置 envConfigNestForDemo.testName 的值
   */
  envConfigForDemo: 'ENV_CONFIG_FOR_DEMO',
  envConfigNestForDemo: {
    testName: 'ENV_CONFIG_TEST_NAME',
  },
};
