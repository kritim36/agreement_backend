import { GridFSBucket } from 'mongodb';
import mongoose from 'mongoose';

let bucket;

export function getVideoBucket() {
  if (!bucket) {
    bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'videos' });
  }
  return bucket;
}
