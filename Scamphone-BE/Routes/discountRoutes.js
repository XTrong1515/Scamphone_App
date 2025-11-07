import express from 'express';
const router = express.Router();
import {
  getDiscounts,
  validateDiscount,
  getAdminDiscounts,
  getDiscountById,
  createDiscount,
  updateDiscount,
  deleteDiscount
} from '../Controllers/discountController.js';
import { protect, admin } from '../Middleware/authMiddleware.js';

// Public routes
router.get('/', getDiscounts);
router.post('/validate', validateDiscount);

// Admin routes
router.get('/admin/all', protect, admin, getAdminDiscounts);
router.get('/:id', protect, admin, getDiscountById);
router.post('/create', protect, admin, createDiscount);
router.put('/:id', protect, admin, updateDiscount);
router.delete('/:id', protect, admin, deleteDiscount);

export default router;
