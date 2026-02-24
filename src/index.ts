import { config } from './config';
import { connectDB } from './config/database';
import app from './app';

// Start server (for local development only - not used on Vercel)
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT}`);
      console.log(`Environment: ${config.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
