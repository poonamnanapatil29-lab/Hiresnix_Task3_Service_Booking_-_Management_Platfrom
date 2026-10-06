import express from 'express';
import { getAdminStats, getAllUsers, toggleProviderVerification } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, authorize('admin'), getAdminStats);
router.get('/users', protect, authorize('admin'), getAllUsers);
router.put('/provider/:id/verify', protect, authorize('admin'), toggleProviderVerification);

export default router;
