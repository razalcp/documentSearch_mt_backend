import mongoose from 'mongoose';
import { config } from './index';

export const connectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState === 1) return;
  try {
    const conn = await mongoose.connect(config.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    if (!process.env.VERCEL) process.exit(1);
    throw error;
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
  } catch (error) {
    console.error('Database disconnection error:', error);
  }
};
