import { Model, Document } from 'mongoose';
import { Application } from 'egg';

export interface AuthModuleSchema extends Document {
  name: string;
  uri: string;
  describe: string;
  isMenu: boolean;
  url: string;
  icon: string;
  sort: number;
  parentId: string;
  system: boolean;
}

export default (app: Application): Model<AuthModuleSchema> => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ModuleSchema = new Schema(
    {
      name: { type: String },
      uri: { type: String, unique: true },
      describe: { type: String },
      isMenu: { type: Boolean, default: false },
      url: { type: String },
      icon: { type: String },
      sort: { type: Number, default: 0 },
      parentId: { type: String }, // parentId 为空时，表示它是顶级 module
      system: { type: Boolean }, // 是否是系统内置
    },
    {
      usePushEach: true,
      timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    },
  );

  return mongoose.model('auth_module', ModuleSchema);
};
