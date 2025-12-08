import express from 'express';
import {
  createProject,
  getAllProjects,
  getProjectById,
  getProjectsByUserId,
  updateProject,
  deleteProject,
  updateMilestone,
  addMember,
  removeMember
} from '../controllers/projectController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All project routes require authentication
// router.use(authenticate);

/**
 * @route   POST /api/projects
 * @desc    Create a new project
 * @access  Manager, HQ
 * @body    { name, project_type, owner_id?, members?, division?, planned_end?, milestones?, budget_planned? }
 */
router.post('/', createProject);

/**
 * @route   GET /api/projects
 * @desc    Get all projects (with optional filters)
 * @access  Authenticated users
 * @query   owner_id, division, project_type, member_id
 */
router.get('/', getAllProjects);

/**
 * @route   GET /api/projects/user/:userId
 * @desc    Get all projects by user ID (owned or member)
 * @access  Authenticated users
 */
router.get('/user/:userId', getProjectsByUserId);

/**
 * @route   GET /api/projects/:id
 * @desc    Get project by ID
 * @access  Authenticated users
 */
router.get('/:id', getProjectById);

/**
 * @route   PUT /api/projects/:id
 * @desc    Update project
 * @access  Manager, HQ
 * @body    { name?, members?, division?, planned_end?, progress?, milestones?, budget_planned?, budget_used? }
 */
router.put('/:id', authorize('manager', 'hq'), updateProject);

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete project
 * @access  Manager, HQ
 */
router.delete('/:id', authorize('manager', 'hq'), deleteProject);

/**
 * @route   PATCH /api/projects/:id/milestones/:milestoneId
 * @desc    Update milestone status
 * @access  Manager, HQ
 * @body    { name?, planned_date?, actual_date?, progress?, status? }
 */
router.patch('/:id/milestones/:milestoneId', authorize('manager', 'hq'), updateMilestone);

/**
 * @route   POST /api/projects/:id/members
 * @desc    Add member to project
 * @access  Manager, HQ
 * @body    { user_id }
 */
router.post('/:id/members', authorize('manager', 'hq'), addMember);

/**
 * @route   DELETE /api/projects/:id/members/:userId
 * @desc    Remove member from project
 * @access  Manager, HQ
 */
router.delete('/:id/members/:userId', authorize('manager', 'hq'), removeMember);

export default router;
