// Main router - combines all routes
import express from 'express';
import adminRoutes from './adminRoutes.js';
import managerRoutes from './managerRoutes.js';
import userRoutes from './userRoutes.js';
import kpiRoutes from './kpiRoutes.js';
import projectRoutes from './projectRoutes.js';

const router = express.Router();

// Mount routes
router.use('/admin', adminRoutes);
router.use('/manager', managerRoutes);
router.use('/users', userRoutes);
router.use('/kpis', kpiRoutes);
router.use('/projects', projectRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;
