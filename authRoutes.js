import express from 'express';
import { register, login, getMe, updateProfile, toggleSaveService } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/save-service/:serviceId', protect, toggleSaveService);

export default router;
