import express from 'express';
import {
  uploadEvidence,
  getAllEvidence,
  getEvidenceById,
  getEvidenceByProject,
  getEvidenceByUser,
  deleteEvidence
} from '../controllers/evidenceController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All evidence routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/evidence
 * @desc    Upload new evidence
 * @access  Authenticated users
 * @body    { uploaded_by?, project_id?, activity_id?, file_url, mime?, size?, gps? }
 */
router.post('/', uploadEvidence);

/**
 * @route   GET /api/evidence
 * @desc    Get all evidence (with optional filters)
 * @access  Authenticated users
 * @query   uploaded_by, project_id, activity_id
 */
router.get('/', getAllEvidence);

/**
 * @route   GET /api/evidence/:id
 * @desc    Get evidence by ID
 * @access  Authenticated users
 */
router.get('/:id', getEvidenceById);

/**
 * @route   GET /api/evidence/project/:projectId
 * @desc    Get all evidence for a project
 * @access  Authenticated users
 */
router.get('/project/:projectId', getEvidenceByProject);

/**
 * @route   GET /api/evidence/user/:userId
 * @desc    Get all evidence uploaded by a user
 * @access  Authenticated users
 */
router.get('/user/:userId', getEvidenceByUser);

/**
 * @route   DELETE /api/evidence/:id
 * @desc    Delete evidence
 * @access  Manager, HQ
 */
router.delete('/:id', authorize('manager', 'hq'), deleteEvidence);

export default router;
