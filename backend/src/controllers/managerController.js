import Team from '../models/Team.js';
import User from '../models/User.js';
import Activities from '../models/Activities.js';

/**
 * Manager Controller
 * Handles manager-specific operations like team creation and task management
 */

/**
 * Create a new team
 * POST /api/manager/teams
 * Body: { teamName, teamMemberEmails, teamLeaderEmail, description, division }
 * 
 * req.body = {
 *   teamName: string (required),
 *   teamMemberEmails: string[] (required),
 *   teamLeaderEmail: string (required),
 *   description: string (optional),
 *   division: string (optional)
 * }
 */
export const createTeam = async (req, res, next) => {
  try {
    const { teamName, teamMemberEmails, teamLeaderEmail, description, division } = req.body;

    // Validate required fields
    if (!teamName || !teamMemberEmails || !teamLeaderEmail) {
      return res.status(400).json({ 
        error: 'Missing required fields', 
        required: ['teamName', 'teamMemberEmails', 'teamLeaderEmail'] 
      });
    }

    // Validate team member emails is an array
    if (!Array.isArray(teamMemberEmails)) {
      return res.status(400).json({ 
        error: 'teamMemberEmails must be an array' 
      });
    }

    // Check if team already exists
    const existingTeam = await Team.findOne({ name: teamName });
    if (existingTeam) {
      return res.status(409).json({ 
        error: 'Team already exists with this name' 
      });
    }

    // Find team leader by email
    const teamLeader = await User.findOne({ email: teamLeaderEmail });
    if (!teamLeader) {
      return res.status(404).json({ 
        error: 'Team leader not found with provided email' 
      });
    }

    // Find all team members by email
    const teamMembers = await User.find({ 
      email: { $in: teamMemberEmails } 
    });

    if (teamMembers.length !== teamMemberEmails.length) {
      const foundEmails = teamMembers.map(member => member.email);
      const notFoundEmails = teamMemberEmails.filter(email => !foundEmails.includes(email));
      return res.status(404).json({ 
        error: 'Some team members not found', 
        notFoundEmails 
      });
    }

    // Get member IDs (emp_code) for updating user records
    const memberIds = teamMembers.map(member => member.emp_code);

    // Create new team (store emails in members array)
    const newTeam = new Team({
      name: teamName,
      division: division || teamLeader.division || 'General',
      leader_email: teamLeaderEmail,
      members: teamMemberEmails,
      description: description || '',
      created_at: new Date(),
      updated_at: new Date()
    });

    await newTeam.save();

    // Update all team members to assign them to this team
    await User.updateMany(
      { emp_code: { $in: memberIds } },
      { 
        $set: { 
          team: teamName,
          manager_id: teamLeader.emp_code,
          updated_at: new Date()
        }
      }
    );

    // Also update team leader
    await User.findOneAndUpdate(
      { emp_code: teamLeader.emp_code },
      { 
        $set: { 
          team: teamName,
          updated_at: new Date()
        }
      }
    );

    // Populate the response
    const populatedTeam = await Team.findById(newTeam._id)
      .populate('leader_email', 'name email emp_code')
      .populate('members', 'name email emp_code');

    res.status(201).json({
      message: 'Team created successfully',
      team: populatedTeam
    });

  } catch (error) {
    console.error('Error creating team:', error);
    next(error);
  }
};

/**
 * Get all teams
 * GET /api/manager/teams
 */
export const getAllTeams = async (req, res, next) => {
  try {
    const { division } = req.query;
    
    const filter = {};
    if (division) filter.division = division;

    const teams = await Team.find(filter)
      .populate('leader_email', 'name email emp_code')
      .populate('members', 'name email emp_code')
      .sort({ created_at: -1 });

    res.json({
      count: teams.length,
      teams
    });

  } catch (error) {
    console.error('Error fetching teams:', error);
    next(error);
  }
};

/**
 * Get team by ID
 * GET /api/manager/teams/:id
 */
export const getTeamById = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('leader_email', 'name email emp_code role designation')
      .populate('members', 'name email emp_code role designation');
    
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.json({ team });

  } catch (error) {
    console.error('Error fetching team:', error);
    next(error);
  }
};

/**
 * Update team
 * PUT /api/manager/teams/:id
 * 
 * req.body = {
 *   teamName: string (optional),
 *   teamMemberEmails: string[] (optional),
 *   teamLeaderEmail: string (optional),
 *   description: string (optional),
 *   division: string (optional)
 * }
 */
export const updateTeam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { teamName, teamMemberEmails, teamLeaderEmail, description, division } = req.body;

    const updateData = { updated_at: new Date() };

    // Update team name
    if (teamName) {
      updateData.name = teamName;
    }

    // Update description
    if (description !== undefined) {
      updateData.description = description;
    }

    // Update division
    if (division) {
      updateData.division = division;
    }

    // Update team leader
    if (teamLeaderEmail) {
      const teamLeader = await User.findOne({ email: teamLeaderEmail });
      if (!teamLeader) {
        return res.status(404).json({ 
          error: 'Team leader not found with provided email' 
        });
      }
      updateData.leader_email = teamLeaderEmail;
    }

    // Update team members
    if (teamMemberEmails && Array.isArray(teamMemberEmails)) {
      const teamMembers = await User.find({ 
        email: { $in: teamMemberEmails } 
      });

      if (teamMembers.length !== teamMemberEmails.length) {
        const foundEmails = teamMembers.map(member => member.email);
        const notFoundEmails = teamMemberEmails.filter(email => !foundEmails.includes(email));
        return res.status(404).json({ 
          error: 'Some team members not found', 
          notFoundEmails 
        });
      }

      const memberIds = teamMembers.map(member => member.emp_code);
      updateData.members = teamMemberEmails;

      // Update user records
      await User.updateMany(
        { emp_code: { $in: memberIds } },
        { 
          $set: { 
            team: teamName || (await Team.findById(id)).name,
            updated_at: new Date()
          }
        }
      );
    }

    const team = await Team.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    )
      .populate('leader_email', 'name email emp_code')
      .populate('members', 'name email emp_code');

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.json({
      message: 'Team updated successfully',
      team
    });

  } catch (error) {
    console.error('Error updating team:', error);
    next(error);
  }
};

/**
 * Delete team
 * DELETE /api/manager/teams/:id
 */
export const deleteTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Remove team assignment from all members
    await User.updateMany(
      { team: team.name },
      { 
        $set: { 
          team: null,
          manager_id: null,
          updated_at: new Date()
        }
      }
    );

    await Team.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Team deleted successfully',
      teamId: req.params.id
    });

  } catch (error) {
    console.error('Error deleting team:', error);
    next(error);
  }
};

/**
 * Create a new task/activity
 * POST /api/manager/tasks
 * Body: { userId, projectId, type, action, fileId, tatDays, progress, meta }
 * 
 * req.body = {
 *   userId: string (required) - emp_code of the user,
 *   projectId: string (optional),
 *   type: 'file' | 'project' (required),
 *   action: 'received' | 'closed' | 'update' | 'progress' (required),
 *   fileId: string (optional),
 *   tatDays: number (optional),
 *   progress: number (optional) - 0-100,
 *   meta: object (optional)
 * }
 */
export const createTask = async (req, res, next) => {
  try {
    const { 
      userId, 
      projectId, 
      type, 
      action, 
      fileId, 
      tatDays, 
      progress, 
      meta 
    } = req.body;

    // Validate required fields
    if (!userId || !type || !action) {
      return res.status(400).json({ 
        error: 'Missing required fields', 
        required: ['userId', 'type', 'action'] 
      });
    }

    // Validate type
    const validTypes = ['file', 'project'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ 
        error: 'Invalid type', 
        validTypes 
      });
    }

    // Validate action
    const validActions = ['received', 'closed', 'update', 'progress'];
    if (!validActions.includes(action)) {
      return res.status(400).json({ 
        error: 'Invalid action', 
        validActions 
      });
    }

    // Check if user exists
    const user = await User.findOne({ emp_code: userId });
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found with provided userId' 
      });
    }

    // Create new activity/task
    const newActivity = new Activities({
      user_id: userId,
      project_id: projectId || null,
      type,
      action,
      timestamp: new Date(),
      file_id: fileId || null,
      tat_days: tatDays || null,
      progress: progress || null,
      meta: meta || {}
    });

    await newActivity.save();

    res.status(201).json({
      message: 'Task created successfully',
      task: newActivity
    });

  } catch (error) {
    console.error('Error creating task:', error);
    next(error);
  }
};

/**
 * Get all tasks/activities
 * GET /api/manager/tasks
 */
export const getAllTasks = async (req, res, next) => {
  try {
    const { userId, projectId, type, action, startDate, endDate } = req.query;
    
    const filter = {};
    if (userId) filter.user_id = userId;
    if (projectId) filter.project_id = projectId;
    if (type) filter.type = type;
    if (action) filter.action = action;
    
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    const tasks = await Activities.find(filter)
      .populate('user_id', 'name email emp_code role')
      .sort({ timestamp: -1 });

    res.json({
      count: tasks.length,
      tasks
    });

  } catch (error) {
    console.error('Error fetching tasks:', error);
    next(error);
  }
};

/**
 * Get task by ID
 * GET /api/manager/tasks/:id
 */
export const getTaskById = async (req, res, next) => {
  try {
    const task = await Activities.findById(req.params.id)
      .populate('user_id', 'name email emp_code role designation');
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ task });

  } catch (error) {
    console.error('Error fetching task:', error);
    next(error);
  }
};

/**
 * Update task
 * PUT /api/manager/tasks/:id
 * 
 * req.body = {
 *   projectId: string (optional),
 *   action: 'received' | 'closed' | 'update' | 'progress' (optional),
 *   fileId: string (optional),
 *   tatDays: number (optional),
 *   progress: number (optional) - 0-100,
 *   meta: object (optional)
 * }
 */
export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // Don't allow updating userId or type after creation
    delete updateData.user_id;
    delete updateData.type;
    delete updateData.timestamp;

    const task = await Activities.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    ).populate('user_id', 'name email emp_code');

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({
      message: 'Task updated successfully',
      task
    });

  } catch (error) {
    console.error('Error updating task:', error);
    next(error);
  }
};

/**
 * Delete task
 * DELETE /api/manager/tasks/:id
 */
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Activities.findByIdAndDelete(req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({
      message: 'Task deleted successfully',
      taskId: req.params.id
    });

  } catch (error) {
    console.error('Error deleting task:', error);
    next(error);
  }
};
