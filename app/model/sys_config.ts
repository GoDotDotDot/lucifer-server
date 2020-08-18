import { Model, Document } from 'mongoose';
import { Application } from 'egg';

export interface CommonConfigSchema extends Document {
  name: string;
  value: object;
}

export default (app: Application): Model<CommonConfigSchema> => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ConfigSchema = new Schema(
    {
      name: { type: String, unique: true },
      value: { type: Object }, // 配置项内容，根据config_attr配置字段，值存储在这里
    },
    {
      usePushEach: true,
      timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    },
  );

  return mongoose.model('common_config', ConfigSchema);
};
