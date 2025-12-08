import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * Admin Controller
 * Handles admin-specific operations like user registration
 */

/**
 * Register a new user
 * POST /api/admin/register
 * Body: { email, name, password, role, teamName }
 * 
 * req.body = {
 *   email: string (required),
 *   name: string (required),
 *   password: string (required),
 *   role: 'hq' | 'field' | 'manager' (required),
 *   teamName: string (optional),
 *   designation: string (optional),
 *   division: string (optional),
 *   emp_code: string (optional)
 * }
 */
export const registerUser = async (req, res, next) => {
  try {
    const { email, name, password, role, teamName, designation, division, emp_code } = req.body;

    // Validate required fields
    if (!email || !name || !password || !role) {
      return res.status(400).json({ 
        error: 'Missing required fields', 
        required: ['email', 'name', 'password', 'role'] 
      });
    }

    // Validate role
    const validRoles = ['hq', 'field', 'manager'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        error: 'Invalid role', 
        validRoles 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { emp_code }] 
    });
    
    if (existingUser) {
      return res.status(409).json({ 
        error: 'User already exists with this email or employee code' 
      });
    }

    // Hash password (commented out for now - storing plain text)
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      emp_code: emp_code || `EMP${Date.now()}`,
      name,
      email,
      password: password, // Using plain text password for now
      role,
      team: teamName || null,
      designation: designation || null,
      division: division || null,
      created_at: new Date(),
      updated_at: new Date()
    });

    await newUser.save();

    // Remove password from response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse
    });

  } catch (error) {
    console.error('Error registering user:', error);
    next(error);
  }
};

/**
 * Get all users
 * GET /api/admin/users
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const { role, division, team } = req.query;
    
    const filter = {};
    if (role) filter.role = role;
    if (division) filter.division = division;
    if (team) filter.team = team;

    const users = await User.find(filter)
      .select('-password')
      .sort({ created_at: -1 });

    res.json({
      count: users.length,
      users
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    next(error);
  }
};

/**
 * Get user by ID
 * GET /api/admin/users/:id
 */
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });

  } catch (error) {
    console.error('Error fetching user:', error);
    next(error);
  }
};

/**
 * Update user
 * PUT /api/admin/users/:id
 * 
 * req.body = {
 *   name: string (optional),
 *   email: string (optional),
 *   role: 'hq' | 'field' | 'manager' (optional),
 *   designation: string (optional),
 *   division: string (optional),
 *   team: string (optional),
 *   manager_id: string (optional),
 *   skills: string[] (optional),
 *   location: { lat: number, lng: number } (optional)
 * }
 */
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // Remove fields that shouldn't be updated directly
    delete updateData.password;
    delete updateData.emp_code;
    
    updateData.updated_at = new Date();

    const user = await User.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User updated successfully',
      user
    });

  } catch (error) {
    console.error('Error updating user:', error);
    next(error);
  }
};

/**
 * Delete user
 * DELETE /api/admin/users/:id
 */
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User deleted successfully',
      userId: req.params.id
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    next(error);
  }
};
