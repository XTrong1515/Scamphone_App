import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './Models/UserModel.js';

dotenv.config();

async function testConnection() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/scamphone';
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB successfully');

    // Test creating a user
    try {
      const testUser = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpassword123',
        role: 'admin'
      });

      await testUser.save();
      console.log('Test user created successfully');

      // Query the user back
      const foundUser = await User.findOne({ email: 'test@example.com' });
      console.log('Found user:', foundUser);

    } catch (userError) {
      // If user already exists, just log it
      if (userError.code === 11000) {
        console.log('Test user already exists, skipping creation');
        const foundUser = await User.findOne({ email: 'test@example.com' });
        console.log('Found existing user:', foundUser);
      } else {
        throw userError;
      }
    }

    console.log('Database test completed successfully');
    
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
}

testConnection();