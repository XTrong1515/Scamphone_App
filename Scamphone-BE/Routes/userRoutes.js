import express from 'express';
const router = express.Router();
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUserStats,
} from '../Controllers/userController.js';
import { protect } from '../Middleware/authMiddleware.js';

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/stats', protect, getUserStats);

export default router;