import express from 'express';
import { getCategories, createCategory } from '../controllers/categoryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCategories);
router.post('/', protect, authorize('admin'), createCategory);

export default router;
