import { Subscription } from 'egg';
import * as ms from 'humanize-ms';
import * as cronParser from 'cron-parser';
import * as os from 'os';

const hostname = os.hostname();

interface ClusterSchedule {
  /**
   * Redis 锁的键名
   */
  lockKey: string;
  /**
   * 配置该参数为 true 时，这个定时任务不会被启动。
   */
  disable?: boolean;
  /**
   * 参数来配置定时任务的执行时机，定时任务将会每间隔指定的时间执行一次。interval 可以配置成
   * 数字类型，单位为毫秒数，例如 5000。
   * 字符类型，会通过 ms 转换成毫秒数，例如 5s。
   */
  interval?: string | number;
  /**
   * 定时任务将会按照 cron 表达式在特定的时间点执行。cron 表达式通过 cron-parser 进行解析。
   */
  cron?: string;
  /**
   * 配置 cron 的时区等，参见 cron-parser 文档
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cronOptions?: any;
  /**
   * 配置了该参数为 true 时，这个定时任务会在应用启动并 ready 后立刻执行一次这个定时任务。
   */
  immediate?: boolean;
  /**
   * 数组，仅在指定的环境下才启动该定时任务。
   */
  env?: string[];
}

/**
 * 基于 Redis 锁的分布式定时任务实现，使用锁抢占模式，谁抢占到锁，谁就可以执行定时任务
 */
export class ClusterSubscription extends Subscription {
  lockMS = 0;
  lockKey = '';
  lockTimeRate = 0.99;
  static clusterSchedule: ClusterSchedule;

  constructor(props) {
    super(props);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const c: any = this.constructor;
    // 如果未定义 clusterSubscribe，抛出一个错误
    const anyThis: any = this; // eslint-disable-line @typescript-eslint/no-this-alias, @typescript-eslint/no-explicit-any
    if (typeof anyThis.clusterSubscribe !== 'function') {
      throw new TypeError('Expected clusterSubscribe to be a function');
    }
    const { cron, interval, lockKey } = c.clusterSchedule;
    if (typeof interval === 'string') {
      this.lockMS = Math.max(ms(interval), 0);
    } else if (typeof interval === 'number') {
      this.lockMS = interval;
    } else if (cron) {
      const c = cronParser.parseExpression(cron);
      const t = c.next().getTime() - Date.now();
      this.lockMS = Math.max(t, 0);
    }

    this.lockKey = lockKey;
  }

  static get schedule() {
    // 如果未配置 clusterSchedule，抛出一个错误
    if (typeof this.clusterSchedule !== 'object') {
      throw new TypeError('Expected clusterSchedule to be an object');
    }
    // 如果未设置 lockKey，抛出一个错误
    const { lockKey } = this.clusterSchedule;
    if (!(typeof lockKey === 'string' && lockKey)) {
      throw new TypeError(
        'Expected lockKey in clusterSchedule to be an string',
      );
    }
    return Object.assign({}, this.clusterSchedule, {
      // 这里强制只允许一个 worker 执行分布式定时任务
      type: 'worker',
    });
  }

  subscribe = async () => {
    // 尝试获取 Redis 锁，
    let redis;
    if (this.app.config.redis.client) {
      redis = this.app.redis;
    } else {
      redis = this.app.redis.get('schedule');
    }
    const t = await redis.set(
      `schedule:${this.lockKey}`,
      hostname,
      'NX',
      'PX',
      Math.floor(this.lockMS * this.lockTimeRate),
    );
    /**
     * null => 未获取到锁， 'OK' => 获取到锁，执行分布式定时任务的主体函数
     */
    if (t === 'OK') {
      // eslint-disable-next-line @typescript-eslint/no-this-alias, @typescript-eslint/no-explicit-any
      const anyThis: any = this;
      anyThis.clusterSubscribe();
    }
    /* tslint:disable */
  };
  /* tslint:enable */
}
