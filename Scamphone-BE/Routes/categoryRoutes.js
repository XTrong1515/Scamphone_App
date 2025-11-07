import express from 'express';
const router = express.Router();
import { getCategories, createCategory, updateCategory, deleteCategory } from '../Controllers/categoryController.js';
import { protect, admin } from '../Middleware/authMiddleware.js';

router.get('/', getCategories);
router.post('/', protect, admin, createCategory);
router.put('/:id', protect, admin, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

export default router;
