import { Model, Document } from 'mongoose';
import { Application } from 'egg';

export interface AuthGroupSchema extends Document {
  name: string;
  describe: string;
  users: string[];
  modules: string[];
}

export default (app: Application): Model<AuthGroupSchema> => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const GroupSchema = new Schema(
    {
      name: { type: String, unique: true },
      describe: { type: String },
      users: { type: Array },
      modules: { type: Array },
    },
    {
      usePushEach: true,
      timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    },
  );

  return mongoose.model('auth_group', GroupSchema);
};
