import express from 'express';
import { requestPasswordReset, resetPassword } from '../Controllers/passwordResetController.js';

const router = express.Router();

// Route để yêu cầu reset password
router.post('/request-reset', requestPasswordReset);

// Route để reset password với token
router.post('/reset', resetPassword);

export default router;