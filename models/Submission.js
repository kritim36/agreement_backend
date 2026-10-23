import mongoose from 'mongoose';
import { milestoneSchema } from './SiteContent.js';

const videoConsentSchema = new mongoose.Schema(
  {
    fileId: mongoose.Schema.Types.ObjectId, // GridFS file id
    filePath: String, // legacy: videos stored on local disk before the GridFS migration
    originalName: String,
    mimeType: String,
    sizeBytes: Number,
    recordedAt: Date,
  },
  { _id: false }
);

// The fee structure this student agreed to, saved when the student is created:
// either a copy of the CMS fee structure or a custom one set by an admin.
// Null only on submissions created before fee structures were saved.
const feeStructureSchema = new mongoose.Schema(
  {
    totalChargeLabel: { type: String, default: '' },
    totalChargeBreakdown: { type: String, default: '' },
    totalChargeAmount: { type: String, default: '' },
    milestoneColumnLabel: { type: String, default: '' },
    milestones: { type: [milestoneSchema], default: [] },
    refundNote: { type: String, default: '' },
  },
  { _id: false }
);

const submissionSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    email: { type: String, required: true },
    desiredProgram: { type: String, required: true },

    status: {
      type: String,
      enum: ['awaiting-video', 'completed'],
      default: 'awaiting-video',
      index: true,
    },

    agreedAt: { type: Date, default: Date.now },
    videoConsent: { type: videoConsentSchema, default: null },
    emailSentAt: { type: Date, default: null },
    feeStructure: { type: feeStructureSchema, default: null },
    customFeeStructure: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Copies the site-wide fee structure so the student's record keeps the fees
// they were shown even if the CMS content changes later.
export function snapshotFeeStructure(siteContent) {
  const { totalChargeLabel, totalChargeBreakdown, totalChargeAmount, milestoneColumnLabel, milestones, refundNote } =
    siteContent.toObject().feeStructure;
  return { totalChargeLabel, totalChargeBreakdown, totalChargeAmount, milestoneColumnLabel, milestones, refundNote };
}

export default mongoose.models.Submission || mongoose.model('Submission', submissionSchema);
