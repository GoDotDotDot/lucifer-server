import { Model, Document } from 'mongoose';
import { Application } from 'egg';

export interface AuthUserSchema extends Document {
  name: string;
  account: string;
  password: string;
  remark: string;
  status: number;
  qq: number;
  sex: number;
  address: string;
  mobile: string;
  email: string;
  ga: string;
  lockInfo: {
    lock: boolean;
    count: number;
    lockDate: Date | undefined;
  };
  description: string;
  twoFA: {
    sms: boolean;
    email: boolean;
    ga: boolean;
  };
}

export default (app: Application): Model<AuthUserSchema> => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema(
    {
      name: { type: String },
      account: { type: String, unique: true },
      password: { type: String },
      remark: { type: String },
      status: { type: Number },
      qq: { type: Number },
      sex: { type: Number },
      address: { type: String },
      mobile: { type: String },
      email: { type: String },
      description: { type: String },
      // 谷歌验证秘钥
      ga: { type: String },
      // 双重验证类型，例如谷歌、短信验证码
      twoFA: {
        sms: { type: Boolean, default: false },
        email: { type: Boolean, default: false },
        ga: { type: Boolean, default: false },
      },
      // 错误次数限制
      lockInfo: {
        lock: {
          type: Boolean,
          default: false,
        },
        count: {
          type: Number,
          default: 0,
        },
        lockDate: {
          type: Date,
        },
      },
    },
    {
      usePushEach: true,
      timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    },
  );

  return mongoose.model('auth_user', UserSchema);
};
