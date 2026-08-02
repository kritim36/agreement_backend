import { Router } from 'express';
import { getPublicContent } from '../controllers/contentController.js';
import {
  createSubmission,
  confirmAgreement,
  uploadVideoConsent,
  getPublicSubmission,
  streamPublicVideo,
} from '../controllers/publicSubmissionController.js';
import { uploadVideo } from '../middleware/upload.js';

const router = Router();

router.get('/content', getPublicContent);
router.post('/submissions', createSubmission);
router.patch('/submissions/:id/agree', confirmAgreement);
router.post('/submissions/:id/video', uploadVideo.single('video'), uploadVideoConsent);
router.get('/submissions/:id', getPublicSubmission);
router.get('/submissions/:id/video', streamPublicVideo);

export default router;
