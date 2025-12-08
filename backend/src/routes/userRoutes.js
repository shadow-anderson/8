// User-related API endpoints
import express from 'express';
import { login, } from '../controllers/userController.js';
// import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   POST /api/users/login
 * @desc    Login user
 * @access  Public
 * @body    { email, password }
 */
router.post('/login', login);

// GET /api/users - Get all users
// router.get('/', authenticate, userController.getAllUsers);

// GET /api/users/:id - Get user by ID
// router.get('/:id', authenticate, userController.getUserById);

// POST /api/users - Create new user
// router.post('/', userController .createUser);

// PUT /api/users/:id - Update user
// router.put('/:id', authenticate, userController.updateUser);

// DELETE /api/users/:id - Delete user
// router.delete('/:id', authenticate, userController.deleteUser);

export default router;
