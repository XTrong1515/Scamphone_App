import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './Models/UserModel.js';

dotenv.config();

async function createAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    const email = 'txtrong109@gmail.com';
    const password = 'trong1515';

    // Check if user already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      console.log('⚠️ User already exists. Deleting and recreating...');
      await User.deleteOne({ _id: existing._id });
    }

    // Create admin user (pre-save hook will hash password automatically)
    const admin = await User.create({
      name: 'Admin',
      email: email.toLowerCase(),
      password: password, // Don't hash here - let pre-save hook do it
      phone: '',
      role: 'admin',
      avatar: `https://ui-avatars.com/api/?name=Admin&background=3b82f6&color=fff&size=200`,
      preferences: {
        notifications: true,
        newsletter: false
      }
    });

    console.log('✅ Admin created successfully!');
    console.log('ID:', admin._id);
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('Password hash:', admin.password.slice(0, 20) + '...');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
