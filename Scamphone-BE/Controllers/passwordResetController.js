import User from '../Models/UserModel.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Tạo token reset password
const generateResetToken = () => {
  return crypto.randomBytes(20).toString('hex');
};

// Gửi yêu cầu reset password
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy tài khoản với email này' });
    }

    // Tạo token và thời gian hết hạn (1 giờ)
    const resetToken = generateResetToken();
    const resetTokenExpiry = Date.now() + 3600000; // 1 giờ

    // Lưu token vào database
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Trong thực tế, bạn sẽ gửi email ở đây
    // Nhưng để test, chúng ta sẽ trả về token
    res.json({
      message: 'Link reset password đã được gửi vào email của bạn',
      // Chỉ trả về token trong development
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Verify token và reset password
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        message: 'Token không hợp lệ hoặc đã hết hạn'
      });
    }

    // Cập nhật password và xóa token (pre-save hook sẽ tự hash)
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Mật khẩu đã được cập nhật thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};