import express from 'express';
import {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask
} from '../controllers/managerController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All manager routes require authentication and manager role
router.use(authenticate);
router.use(authorize('manager', 'hq')); // Managers and HQ (admin) can access

// ==================== TEAM ROUTES ====================

/**
 * @route   POST /api/manager/teams
 * @desc    Create a new team
 * @access  Manager only
 * @body    { teamName, teamMemberEmails, teamLeaderEmail, description, division }
 */
router.post('/teams', createTeam);

/**
 * @route   GET /api/manager/teams
 * @desc    Get all teams (with optional filters)
 * @access  Manager only
 * @query   division
 */
router.get('/teams', getAllTeams);

/**
 * @route   GET /api/manager/teams/:id
 * @desc    Get team by ID
 * @access  Manager only
 */
router.get('/teams/:id', getTeamById);

/**
 * @route   PUT /api/manager/teams/:id
 * @desc    Update team
 * @access  Manager only
 * @body    { teamName, teamMemberEmails, teamLeaderEmail, description, division }
 */
router.put('/teams/:id', updateTeam);

/**
 * @route   DELETE /api/manager/teams/:id
 * @desc    Delete team
 * @access  Manager only
 */
router.delete('/teams/:id', deleteTeam);

// ==================== TASK ROUTES ====================

/**
 * @route   POST /api/manager/tasks
 * @desc    Create a new task/activity
 * @access  Manager only
 * @body    { userId, projectId, type, action, fileId, tatDays, progress, meta }
 */
router.post('/tasks', createTask);

/**
 * @route   GET /api/manager/tasks
 * @desc    Get all tasks/activities (with optional filters)
 * @access  Manager only
 * @query   userId, projectId, type, action, startDate, endDate
 */
router.get('/tasks', getAllTasks);

/**
 * @route   GET /api/manager/tasks/:id
 * @desc    Get task by ID
 * @access  Manager only
 */
router.get('/tasks/:id', getTaskById);

/**
 * @route   PUT /api/manager/tasks/:id
 * @desc    Update task
 * @access  Manager only
 * @body    { action, fileId, tatDays, progress, meta }
 */
router.put('/tasks/:id', updateTask);

/**
 * @route   DELETE /api/manager/tasks/:id
 * @desc    Delete task
 * @access  Manager only
 */
router.delete('/tasks/:id', deleteTask);

export default router;
