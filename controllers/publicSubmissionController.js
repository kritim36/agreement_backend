import Submission from '../models/Submission.js';
import { getVideoBucket } from '../utils/gridfs.js';

export async function createSubmission(req, res, next) {
  try {
    const { fullName, mobileNumber, email, desiredProgram } = req.body;
    if (!fullName || !mobileNumber || !email || !desiredProgram) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const submission = await Submission.create({
      fullName,
      mobileNumber,
      email,
      desiredProgram,
      agreedAt: new Date(),
    });

    res.status(201).json({ id: submission._id });
  } catch (error) {
    next(error);
  }
}

export async function uploadVideoConsent(req, res, next) {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) return res.status(404).json({ error: 'Submission not found' });
    if (!req.file) return res.status(400).json({ error: 'No video file received' });

    const bucket = getVideoBucket();
    const fileId = await new Promise((resolve, reject) => {
      const uploadStream = bucket.openUploadStream(req.file.originalname, {
        contentType: req.file.mimetype,
      });
      uploadStream.on('finish', () => resolve(uploadStream.id));
      uploadStream.on('error', reject);
      uploadStream.end(req.file.buffer);
    });

    submission.videoConsent = {
      fileId,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      sizeBytes: req.file.size,
      recordedAt: new Date(),
    };
    submission.status = 'completed';
    await submission.save();

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}
