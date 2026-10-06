import express from 'express';
import { createBooking, getCustomerBookings, getProviderBookings, updateBookingStatus } from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/customer', protect, getCustomerBookings);
router.get('/provider', protect, authorize('provider', 'admin'), getProviderBookings);
router.put('/:id/status', protect, updateBookingStatus);

export default router;
