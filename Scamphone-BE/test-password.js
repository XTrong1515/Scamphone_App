import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './Models/UserModel.js';

dotenv.config();

async function testPassword() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email: 'test@example.com' });
    
    if (!user) {
      console.log('❌ User not found!');
      process.exit(1);
    }

    console.log('✅ User found:', user.email);
    console.log('Stored hash:', user.password);
    
    const password = 'FinalPass789';
    console.log('Testing password:', password);
    
    // Test direct bcrypt.compare
    const matchDirect = await bcrypt.compare(password, user.password);
    console.log('Direct bcrypt.compare result:', matchDirect);
    
    // Test via model method
    const matchMethod = await user.comparePassword(password);
    console.log('Model comparePassword result:', matchMethod);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testPassword();
