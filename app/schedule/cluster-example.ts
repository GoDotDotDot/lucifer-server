import { ClusterSubscription } from '@core/ClusterSchedule';

export default class ClusterExample extends ClusterSubscription {
  static get clusterSchedule() {
    return {
      lockKey: 'clusterExample', // Redis 锁的键名，每个定时任务需要不同的键名
      interval: '5s', // 配置同 egg-schedule
      disable: true, // 为 true 时，这个定时任务不会被启动。
    };
  }

  clusterSubscribe() {
    this.logger.info('cluster schedule example');
  }
}
