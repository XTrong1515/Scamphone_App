import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './Models/UserModel.js';

dotenv.config();

async function recreateUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Delete existing user
    const deleted = await User.deleteOne({ email: 'test@example.com' });
    console.log('✅ Deleted:', deleted.deletedCount, 'user(s)');

    // Create new user with PLAIN TEXT password
    const newUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'TestPass123', // Plain text - pre-save hook will hash
      role: 'user'
    });

    console.log('✅ User created successfully!');
    console.log('Email:', newUser.email);
    console.log('Password hash:', newUser.password);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

recreateUser();
