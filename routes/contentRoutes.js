import { Router } from 'express';
import { getContent, updateContent } from '../controllers/contentController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAdmin);

router.get('/', getContent);
router.put('/', updateContent);

export default router;
