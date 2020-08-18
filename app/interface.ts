import { QueryPopulateOptions } from 'mongoose';

export interface Response {
  status?: number;
  code?: number;
  msg?: string;
  data?: object;
}

export interface PaginateQuery {
  page?: number;
  pageSize?: number;
  all?: boolean;
  select?: object | string;
  sort?: object | string;
  populate?: object[] | string[] | object | string | QueryPopulateOptions;
  lean?: boolean;
  leanWithId?: boolean;
  offset?: number;
}

export interface PaginateResult<T> {
  list: T[];
  total: number;
  pageSize: number;
  page?: number;
  pages?: number;
  offset?: number;
}
