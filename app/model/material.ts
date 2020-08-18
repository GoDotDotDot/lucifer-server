import { Model, Document } from 'mongoose';
import { Application } from 'egg';

export interface MaterialSchema extends Document {
  name: string;
  version: string;
  type: string;
  etag: string;
  tags: string[];
  bucketName: string;
  objectName: string;
}

export default (app: Application): Model<MaterialSchema> => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const MaterialSchema = new Schema(
    {
      name: { type: String, required: true, index: true },
      version: { type: String, required: true, index: true },
      type: { type: String, required: true, index: true },
      etag: { type: String, required: true, index: true, unique: true },
      tags: { type: [String], default: [] },
      bucketName: String,
      objectName: String,
    },
    {
      usePushEach: true,
      timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    },
  );

  return mongoose.model('material', MaterialSchema);
};
