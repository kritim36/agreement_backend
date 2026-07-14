import { Router } from 'express';
import { login, logout, me } from '../controllers/authController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', requireAdmin, me);

export default router;
