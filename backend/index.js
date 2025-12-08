import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './src/routes/index.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import { MONGODB_URI, PORT, NODE_ENV } from './src/config/env.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// CORS Configuration - Allow all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'SIH Backend API',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', routes);

// Error handling middleware (should be last)
app.use(errorHandler);

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    
    // Start server only in non-serverless environment
    if (NODE_ENV !== 'production') {
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📍 Environment: ${NODE_ENV}`);
      });
    }
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// Export for Vercel serverless
export default app;
