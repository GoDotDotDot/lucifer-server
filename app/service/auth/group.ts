import Service from '@core/baseService';

export default class GroupService extends Service {
  constructor(ctx) {
    super(ctx);
    this.model = ctx.model.AuthGroup;
  }

  async all() {
    const list = await this.model.find({});
    return { list };
  }

  async create(data) {
    const result = await this.model.create(data);

    return result;
  }

  async destroy(id) {
    const result = await this.model.remove({
      _id: id,
    });

    return result;
  }

  async update(id, data) {
    const newData = Object.assign(data, { _id: id });

    try {
      return await this.model
        .findByIdAndUpdate(id, newData, {
          new: true,
          runValidators: true,
        })
        .exec();
    } catch (err) {
      this.ctx.logger.error(err.message);
      return '';
    }
  }
}
