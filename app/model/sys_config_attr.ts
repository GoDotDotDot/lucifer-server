import { Model, Document } from 'mongoose';
import { Application } from 'egg';

export interface CommonConfigAttrSchema extends Document {
  configName: string;
  field: string;
  name: string;
  type: 'TEXT' | 'SELECT' | 'RADIO';
  options: string[];
  isRequired: boolean;
  defaultValue: string;
  helpText: string;
  isOccupyOneline: boolean;
  order: number;
}

export default (app: Application): Model<CommonConfigAttrSchema> => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ConfigAttrSchema = new Schema(
    {
      configName: { type: String, required: true },
      field: { type: String }, // 字段名称
      name: { type: String }, // 字段描述
      type: { type: String, enum: ['TEXT', 'SELECT', 'RADIO'] }, // 字段类型
      options: { type: Array }, // 可选项
      isRequired: { type: Boolean }, // 是否必填
      defaultValue: { type: String }, // 默认值
      helpText: { type: String }, // 帮助信息
      isOccupyOneline: { type: Boolean }, // 是否占据一行
      order: { type: Number, default: 0 }, // 排序，数字越小，排序越靠前
    },
    {
      usePushEach: true,
      timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    },
  );

  return mongoose.model('common_config_attr', ConfigAttrSchema);
};
