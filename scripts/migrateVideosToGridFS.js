import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { connectDatabase, closeDatabase } from '../config/database.js';
import Submission from '../models/Submission.js';
import { getVideoBucket } from '../utils/gridfs.js';

dotenv.config();

async function migrate() {
  await connectDatabase();
  const bucket = getVideoBucket();

  const submissions = await Submission.find({
    'videoConsent.filePath': { $exists: true },
    'videoConsent.fileId': { $exists: false },
  });

  console.log(`Found ${submissions.length} submission(s) with local video files to migrate.`);

  for (const submission of submissions) {
    const { filePath, originalName, mimeType } = submission.videoConsent;
    const absolutePath = path.join(process.cwd(), filePath);

    if (!fs.existsSync(absolutePath)) {
      console.warn(`Skipping ${submission._id}: local file missing at ${filePath} (unrecoverable)`);
      continue;
    }

    const fileId = await new Promise((resolve, reject) => {
      const uploadStream = bucket.openUploadStream(originalName || path.basename(filePath), {
        contentType: mimeType || 'video/webm',
      });
      uploadStream.on('finish', () => resolve(uploadStream.id));
      uploadStream.on('error', reject);
      fs.createReadStream(absolutePath).pipe(uploadStream);
    });

    submission.videoConsent.fileId = fileId;
    await submission.save();
    console.log(`Migrated ${submission._id} -> GridFS file ${fileId}`);
  }

  await closeDatabase();
}

migrate()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Migration failed:', error.message);
    process.exit(1);
  });
