import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './Models/UserModel.js';

dotenv.config();

async function resetAllUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Delete ALL users except admin
    const result = await User.deleteMany({ role: { $ne: 'admin' } });
    console.log(`✅ Deleted ${result.deletedCount} user(s)`);

    // Recreate test user
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'TestPass123', // Plain text - pre-save hook will hash
      role: 'user'
    });
    console.log('✅ Test user created:', testUser.email);

    // Check admin still exists
    const admin = await User.findOne({ email: 'txtrong109@gmail.com' });
    if (admin) {
      console.log('✅ Admin account OK:', admin.email);
    } else {
      console.log('⚠️  Admin not found, creating...');
      const newAdmin = await User.create({
        name: 'Admin',
        email: 'txtrong109@gmail.com',
        password: 'trong1515',
        role: 'admin'
      });
      console.log('✅ Admin created:', newAdmin.email);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

resetAllUsers();
