import Submission from '../models/Submission.js';
import { getOrCreateSiteContent } from '../models/SiteContent.js';
import { getVideoBucket, streamVideoConsent } from '../utils/gridfs.js';
import { sendMail } from '../utils/mailer.js';
import { buildConsentConfirmationEmail } from '../utils/emailTemplates.js';

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

export async function confirmAgreement(req, res, next) {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) return res.status(404).json({ error: 'Submission not found' });

    submission.agreedAt = new Date();
    await submission.save();

    res.json({ success: true });
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

    // Best-effort: don't let a slow/failed SMTP provider block the student's
    // consent submission from completing.
    sendConsentConfirmationEmail(submission).catch((error) => {
      console.error('Failed to send consent confirmation email:', error.message);
    });
  } catch (error) {
    next(error);
  }
}

async function sendConsentConfirmationEmail(submission) {
  const siteContent = await getOrCreateSiteContent();
  const viewUrl = `${process.env.ADMIN_CLIENT_URL || 'http://localhost:3001'}/submissions/${submission._id}`;

  const { subject, html } = buildConsentConfirmationEmail({ submission, siteContent, viewUrl });
  await sendMail({ to: submission.email, subject, html });

  submission.emailSentAt = new Date();
  await submission.save();
}

export async function getPublicSubmission(req, res, next) {
  try {
    const submission = await Submission.findById(req.params.id).select(
      'fullName mobileNumber email desiredProgram agreedAt status videoConsent.recordedAt videoConsent.mimeType'
    );
    if (!submission) return res.status(404).json({ error: 'Submission not found' });
    res.json(submission);
  } catch (error) {
    next(error);
  }
}

export async function streamPublicVideo(req, res, next) {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) return res.status(404).json({ error: 'Submission not found' });
    streamVideoConsent(submission.videoConsent, res);
  } catch (error) {
    next(error);
  }
}
