import { Router } from 'express';
import { getPublicContent } from '../controllers/contentController.js';
import { createSubmission, uploadVideoConsent } from '../controllers/publicSubmissionController.js';
import { uploadVideo } from '../middleware/upload.js';

const router = Router();

router.get('/content', getPublicContent);
router.post('/submissions', createSubmission);
router.post('/submissions/:id/video', uploadVideo.single('video'), uploadVideoConsent);

export default router;
