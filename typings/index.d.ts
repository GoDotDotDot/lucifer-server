import { Redis } from 'ioredis';
import { IModel, IRoutesCombine } from 'egg';

type RouteManifest = IRoutesCombine;

type Keys = keyof RouteManifest;

type ResponseFunction = (params?: {
  status?: number;
  code?: number;
  msg?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}) => IResponse


declare module 'egg' {
  interface Application {
    redis: Singleton<Redis> & Redis;
  }

  interface Context {
    model: IModel;
    failure: ResponseFunction;
    success: ResponseFunction;
    badRequest: ResponseFunction;
    unauthorized: ResponseFunction;
    forbidden: ResponseFunction;
    user: {
      id: string;
      username: string;
    };
  }

  interface EggAppConfig {
    rpc: {
      [key: string]: string;
    };
    accountLock: {
      count: number;
      lockTime: number;
    };
  }

  export type JoiSwaggerRoutes = {
    [key in Keys]: RouteManifest[key]['options'];
  };
}

declare module 'mongoose' {
  interface Model {
    paginate(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      query?: Record<string, any>,
      options?: PaginateOptions,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      callback?: (err: any, result: PaginateResult<T>) => void
    ): Promise<PaginateResult<T>>;
  }
}
