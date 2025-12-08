import Project from '../models/Project.js';

/**
 * Create a new project
 * POST /api/projects
 */
export const createProject = async (req, res, next) => {
  try {
    const {
      name,
      description,
      owner_id,
      members,
      project_type,
      planned_end,
      milestones,
      budget_planned
    } = req.body;

  

    // Validate project_type
    if (!['single', 'milestone'].includes(project_type)) {
      return res.status(400).json({
        error: 'Invalid project_type',
        message: 'project_type must be either "single" or "milestone"'
      });
    }

    // Create project
    const project = await Project.create({
      name,
      description: description || '',
      owner_id: owner_id || req.userId,
      members: members || [],
      project_type,
      planned_end,
      milestones: milestones || [],
      budget_planned,
      budget_used: 0,
      progress: 0
    });

    res.status(201).json({
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all projects with optional filters
 * GET /api/projects?owner_id=&division=&project_type=
 */
export const getAllProjects = async (req, res, next) => {
  try {
    const { owner_id, division, project_type, member_id } = req.query;

    const filter = {};
    if (owner_id) filter.owner_id = owner_id;
    if (division) filter.division = division;
    if (project_type) filter.project_type = project_type;
    if (member_id) filter.members = member_id;

    const projects = await Project.find(filter)
      .populate('owner_id', 'name email emp_code')
      .populate('members', 'name email emp_code')
      .sort({ created_at: -1 });

    res.json({
      count: projects.length,
      projects
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get project by ID
 * GET /api/projects/:id
 */
export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner_id', 'name email emp_code')
      .populate('members', 'name email emp_code');

    if (!project) {
      return res.status(404).json({
        error: 'Project not found'
      });
    }

    res.json({ project });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all projects by user ID (owned or member)
 * GET /api/projects/user/:userId
 */
export const getProjectsByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Find projects where user is owner or member (using _id)
    const projects = await Project.find({
      $or: [
        { owner_id: userId },
        { members: userId }
      ]
    })
      .populate('owner_id', 'name email emp_code')
      .populate('members', 'name email emp_code')
      .sort({ created_at: -1 });

    res.json({
      count: projects.length,
      projects
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update project
 * PUT /api/projects/:id
 */
export const updateProject = async (req, res, next) => {
  try {
    const {
      name,
      description,
      members,
      division,
      planned_end,
      progress,
      milestones,
      budget_planned,
      budget_used
    } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        error: 'Project not found'
      });
    }

    // Update fields
    if (name) project.name = name;
    if (description !== undefined) project.description = description;
    if (members) project.members = members;
    if (division) project.division = division;
    if (planned_end) project.planned_end = planned_end;
    if (progress !== undefined) project.progress = progress;
    if (milestones) project.milestones = milestones;
    if (budget_planned !== undefined) project.budget_planned = budget_planned;
    if (budget_used !== undefined) project.budget_used = budget_used;

    await project.save();

    res.json({
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete project
 * DELETE /api/projects/:id
 */
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        error: 'Project not found'
      });
    }

    res.json({
      message: 'Project deleted successfully',
      project
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update milestone status
 * PATCH /api/projects/:id/milestones/:milestoneId
 */
export const updateMilestone = async (req, res, next) => {
  try {
    const { id, milestoneId } = req.params;
    const { name, planned_date, actual_date, progress, status } = req.body;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        error: 'Project not found'
      });
    }

    const milestone = project.milestones.id(milestoneId);

    if (!milestone) {
      return res.status(404).json({
        error: 'Milestone not found'
      });
    }

    // Update milestone fields
    if (name) milestone.name = name;
    if (planned_date) milestone.planned_date = planned_date;
    if (actual_date) milestone.actual_date = actual_date;
    if (progress !== undefined) milestone.progress = progress;
    if (status) milestone.status = status;

    await project.save();

    res.json({
      message: 'Milestone updated successfully',
      project
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add member to project
 * POST /api/projects/:id/members
 */
export const addMember = async (req, res, next) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        error: 'user_id is required'
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        error: 'Project not found'
      });
    }

    // Check if member already exists
    if (project.members.includes(user_id)) {
      return res.status(400).json({
        error: 'User is already a member of this project'
      });
    }

    project.members.push(user_id);
    await project.save();

    res.json({
      message: 'Member added successfully',
      project
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove member from project
 * DELETE /api/projects/:id/members/:userId
 */
export const removeMember = async (req, res, next) => {
  try {
    const { id, userId } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        error: 'Project not found'
      });
    }

    project.members = project.members.filter(
      member => member.toString() !== userId
    );

    await project.save();

    res.json({
      message: 'Member removed successfully',
      project
    });
  } catch (error) {
    next(error);
  }
};
