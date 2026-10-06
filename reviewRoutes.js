import express from 'express';
import { getServiceReviews, createReview, replyToReview } from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/service/:serviceId', getServiceReviews);
router.post('/', protect, createReview);
router.put('/:id/reply', protect, authorize('provider', 'admin'), replyToReview);

export default router;
