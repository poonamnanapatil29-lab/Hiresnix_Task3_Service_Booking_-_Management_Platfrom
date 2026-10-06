import express from 'express';
import { getProviders, getProviderProfile, getProviderDashboardStats, updateAvailability } from '../controllers/providerController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProviders);
router.get('/stats', protect, authorize('provider', 'admin'), getProviderDashboardStats);
router.put('/availability', protect, authorize('provider', 'admin'), updateAvailability);
router.get('/:id', getProviderProfile);

export default router;
