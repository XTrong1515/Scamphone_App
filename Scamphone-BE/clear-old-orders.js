import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './Models/OrderModel.js';

dotenv.config();

const clearOldOrders = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Xóa tất cả đơn hàng cũ
    const result = await Order.deleteMany({});
    console.log(`✅ Đã xóa ${result.deletedCount} đơn hàng cũ`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

clearOldOrders();
