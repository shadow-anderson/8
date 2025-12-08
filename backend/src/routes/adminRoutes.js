import express from 'express';
import {
  registerUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and admin role
// router.use(authenticate);
// router.use(authorize('hq')); // Using 'hq' role as admin based on User model

/**
 * @route   POST /api/admin/register
 * @desc    Register a new user
 * @access  Admin only
 * @body    { email, name, password, role, teamName, designation, division, emp_code }
 */

router.post('/register', registerUser);

/**
 * @route   GET /api/admin/users
 * @desc    Get all users (with optional filters)
 * @access  Admin only
 * @query   role, division, team
 */
router.get('/users', getAllUsers);

/**
 * @route   GET /api/admin/users/:id
 * @desc    Get user by ID
 * @access  Admin only
 */
router.get('/users/:id', getUserById);

/**
 * @route   PUT /api/admin/users/:id
 * @desc    Update user
 * @access  Admin only
 * @body    { name, email, role, designation, division, team, etc. }
 */
router.put('/users/:id', updateUser);

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete user
 * @access  Admin only
 */
router.delete('/users/:id', deleteUser);

export default router;
