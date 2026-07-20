import mongoose from 'mongoose';

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
  },
  { timestamps: true }
);

export default mongoose.models.Submission || mongoose.model('Submission', submissionSchema);
