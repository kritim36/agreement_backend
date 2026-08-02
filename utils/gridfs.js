import { GridFSBucket } from 'mongodb';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';

let bucket;

export function getVideoBucket() {
  if (!bucket) {
    bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'videos' });
  }
  return bucket;
}

export function streamVideoConsent(consent, res) {
  if (!consent?.fileId && !consent?.filePath) {
    return res.status(404).json({ error: 'No video consent found' });
  }

  if (consent.fileId) {
    res.set('Content-Type', consent.mimeType || 'video/webm');
    const downloadStream = getVideoBucket().openDownloadStream(consent.fileId);
    downloadStream.on('error', () => {
      if (!res.headersSent) res.status(404).json({ error: 'Video file not found' });
    });
    downloadStream.pipe(res);
    return;
  }

  // Legacy videos stored on local disk before the GridFS migration.
  const filePath = path.join(process.cwd(), consent.filePath);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Video file not found' });
  }
  res.sendFile(filePath);
}
