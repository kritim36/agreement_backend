import path from 'path';
import fs from 'fs';
import Submission from '../models/Submission.js';
import { getVideoBucket, streamVideoConsent } from '../utils/gridfs.js';

export async function createSubmissionByAdmin(req, res, next) {
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
    });

    res.status(201).json({ id: submission._id });
  } catch (error) {
    next(error);
  }
}

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
    streamVideoConsent(submission?.videoConsent, res);
  } catch (error) {
    next(error);
  }
}
