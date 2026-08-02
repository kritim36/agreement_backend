import { Router } from 'express';
import {
  createSubmissionByAdmin,
  listSubmissions,
  getSubmission,
  deleteSubmission,
  streamVideo,
} from '../controllers/submissionController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAdmin);

router.post('/', createSubmissionByAdmin);
router.get('/', listSubmissions);
router.get('/:id', getSubmission);
router.delete('/:id', deleteSubmission);
router.get('/:id/video', streamVideo);

export default router;
