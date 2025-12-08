import express from 'express';
import { createKpi } from '../controllers/kpiController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All KPI routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/kpis
 * @desc    Create or update KPI
 * @access  Authenticated users
 * @body    { user_id, period, projectId, kpi_code, raw_value, source_count? }
 */
router.post('/', createKpi);

export default router;