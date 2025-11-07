import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import User from './Models/UserModel.js';
import userRoutes from './Routes/userRoutes.js';
import productRoutes from './Routes/productRoutes.js';
import categoryRoutes from './Routes/categoryRoutes.js';
import orderRoutes from './Routes/orderRoutes.js';
import adminRoutes from './Routes/adminRoutes.js';
import passwordResetRoutes from './Routes/passwordResetRoutes.js';
import discountRoutes from './Routes/discountRoutes.js';
import { notFound, errorHandler } from './Middleware/errorMiddleware.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Cho phép server nhận dữ liệu JSON

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

// Định nghĩa các Routes chính
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Direct password set endpoint
app.post('/api/v1/dev/set-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const emailLower = String(email || '').trim().toLowerCase();
    const pass = String(newPassword || '').trim();
    
    if (!emailLower || pass.length < 6) {
      return res.status(400).json({ error: 'Invalid email or password length' });
    }
    
    const user = await User.findOne({ email: emailLower });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(pass, salt);
    await user.save();
    
    res.json({ success: true, message: 'Password updated', email: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/password', passwordResetRoutes);
app.use('/api/v1/discounts', discountRoutes);

// Middleware xử lý lỗi
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));