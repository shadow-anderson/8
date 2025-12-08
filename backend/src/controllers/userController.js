import User from '../models/User.js';
import Team from '../models/Team.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRE } from '../config/env.js';

/**
 * User Controller
 * Handles user-related operations
 */

/**
 * Login user
 * POST /api/users/login
 * 
 * req.body = {
 *   email: string (required),
 *   password: string (required)
 * }
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Missing required fields', 
        required: ['email', 'password'] 
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    // Check password (plain text comparison for now - encryption commented out)
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    const isPasswordValid = password === user.password;
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        emp_code: user.emp_code,
        email: user.email,
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    // Prepare user response (without password)
    const userResponse = {
      _id: user._id,
      emp_code: user.emp_code,
      name: user.name,
      email: user.email,
      role: user.role,
      designation: user.designation,
      division: user.division,
      team: user.team,
      manager_id: user.manager_id,
      skills: user.skills,
      location: user.location,
      created_at: user.created_at,
      updated_at: user.updated_at
    };

    // If user has a team, fetch team info
    let teamInfo = null;
    if (user.team) {
      teamInfo = await Team.findOne({ name: user.team })
        .populate('leader_email', 'name email emp_code')
        .populate('members', 'name email emp_code');
    }

    res.json({
      message: 'Login successful',
      token,
      user: userResponse,
      team: teamInfo
    });

  } catch (error) {
    console.error('Error during login:', error);
    next(error);
  }
};

// Get all users
export const getAllUsers = async (req, res, next) => {
  try {
    // const users = await userService.getAllUsers();
    // res.json(users);
  } catch (error) {
    next(error);
  }
};

// Get user by ID
export const getUserById = async (req, res, next) => {
  try {
    // const user = await userService.getUserById(req.params.id);
    // res.json(user);
  } catch (error) {
    next(error);
  }
};

// Create new user
export const createUser = async (req, res, next) => {
  try {
    // const user = await userService.createUser(req.body);
    // res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

// Update user
export const updateUser = async (req, res, next) => {
  try {
    // const user = await userService.updateUser(req.params.id, req.body);
    // res.json(user);
  } catch (error) {
    next(error);
  }
};

// Delete user
export const deleteUser = async (req, res, next) => {
  try {
    // await userService.deleteUser(req.params.id);
    // res.status(204).send();
  } catch (error) {
    next(error);
  }
};
