import { Service } from 'egg';
import { Model } from 'mongoose';
import { PaginateQuery, PaginateResult } from 'interface';
import { deleteNullOrUndefinedField } from 'utils';

export default class BaseService extends Service {
  public model: Model<any>; // eslint-disable-line @typescript-eslint/no-explicit-any

  constructor(ctx) {
    super(ctx);
    this.model = this.ctx.model.AuthUser;
  }

  async index(page = 1, pageSize = 20, query) {
    const list = await this.model
      .find(query)
      .skip((Number(page) - 1) * pageSize)
      .limit(Number(pageSize));
    const total = await this.model.find(query).countDocuments();
    return {
      list,
      total,
      page,
      pageSize,
    };
  }

  async paginate<T>(
    query: object,
    options: PaginateQuery,
  ): Promise<PaginateResult<T>> {
    const { page = 1, pageSize = 10, all, ...others } = options;
    const filterQuery = deleteNullOrUndefinedField(query);

    if (all) {
      const allResult = await this.model.find(filterQuery);
      return {
        list: allResult,
        total: allResult.length,
        page: 1,
        pageSize: allResult.length,
        pages: 1,
        offset: 1,
      };
    }

    const result = await this.model.paginate(filterQuery, {
      page,
      ...others,
      limit: pageSize,
    });

    const { docs, total, limit, page: resultPage, pages, offset } = result;

    return {
      list: docs,
      total,
      page: resultPage,
      pageSize: limit,
      pages,
      offset,
    };
  }
}
