import path from 'path';
import fs from 'fs';
import Submission from '../models/Submission.js';
import { getVideoBucket } from '../utils/gridfs.js';

export async function listSubmissions(req, res, next) {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);

    const [submissions, total] = await Promise.all([
      Submission.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Submission.countDocuments(),
    ]);

    res.json({ submissions, total, page, limit });
  } catch (error) {
    next(error);
  }
}

export async function getSubmission(req, res, next) {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) return res.status(404).json({ error: 'Submission not found' });
    res.json(submission);
  } catch (error) {
    next(error);
  }
}

export async function deleteSubmission(req, res, next) {
  try {
    const submission = await Submission.findByIdAndDelete(req.params.id);
    if (!submission) return res.status(404).json({ error: 'Submission not found' });

    if (submission.videoConsent?.fileId) {
      getVideoBucket()
        .delete(submission.videoConsent.fileId)
        .catch(() => {});
    } else if (submission.videoConsent?.filePath) {
      const filePath = path.join(process.cwd(), submission.videoConsent.filePath);
      fs.unlink(filePath, () => {});
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

export async function streamVideo(req, res, next) {
  try {
    const submission = await Submission.findById(req.params.id);
    const consent = submission?.videoConsent;
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
  } catch (error) {
    next(error);
  }
}
