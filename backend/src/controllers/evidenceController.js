import Evidence from '../models/Evidence.js';
import User from '../models/User.js';
import Project from '../models/Project.js';

/**
 * Evidence Controller
 * Handles operations related to evidence management
 */

/**
 * Upload new evidence
 * POST /api/evidence
 */
export const uploadEvidence = async (req, res, next) => {
  try {
    const {
      project_id,
      activity_id,
      file_url,
      mime,
      size,
      gps
    } = req.body;

    // Validate required fields
    if (!file_url) {
      return res.status(400).json({
        error: 'file_url is required'
      });
    }

    let managerId = null;

    // If project_id is provided, get the manager from project
    if (project_id) {
      const project = await Project.findById(project_id);
      
      if (!project) {
        return res.status(404).json({
          error: 'Project not found'
        });
      }

      // Get managerId from project's givenBy field
      managerId = project.givenBy;
      
      // Log for debugging
      console.log('Project found:', project._id);
      console.log('Manager ID from project.givenBy:', managerId);
    }

    // Create evidence
    const evidence = await Evidence.create({
      uploaded_by: req.userId,
      project_id,
      activity_id,
      managerId: managerId || null, // Explicitly set managerId
      file_url,
      mime,
      size,
      gps
    });

    // Populate the evidence before sending response
    const populatedEvidence = await Evidence.findById(evidence._id)
      .populate('uploaded_by', 'name email emp_code')
      .populate('project_id', 'name description')
      .populate('managerId', 'name email emp_code');

    res.status(201).json({
      message: 'Evidence uploaded successfully',
      evidence: populatedEvidence
    });
  } catch (error) {
    console.error('Upload evidence error:', error);
    next(error);
  }
};

/**
 * Get all evidence with filters
 * GET /api/evidence
 */
export const getAllEvidence = async (req, res, next) => {
  try {
    const { uploaded_by, project_id, activity_id } = req.query;

    const filter = {};
    if (uploaded_by) filter.uploaded_by = uploaded_by;
    if (project_id) filter.project_id = project_id;
    if (activity_id) filter.activity_id = activity_id;

    const evidences = await Evidence.find(filter)
      .populate('uploaded_by', 'name email emp_code')
      .populate('project_id', 'name')
      .sort({ uploaded_at: -1 });

    res.json({
      count: evidences.length,
      evidences
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get evidence by ID
 * GET /api/evidence/:id
 */
export const getEvidenceById = async (req, res, next) => {
  try {
    const evidence = await Evidence.findById(req.params.id)
      .populate('uploaded_by', 'name email emp_code')
      .populate('project_id', 'name')
      .populate('activity_id');

    if (!evidence) {
      return res.status(404).json({
        error: 'Evidence not found'
      });
    }

    res.json({ evidence });
  } catch (error) {
    next(error);
  }
};

/**
 * Get evidence by project ID
 * GET /api/evidence/project/:projectId
 */
export const getEvidenceByProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    
    const evidences = await Evidence.find({ project_id: projectId })
      .populate('uploaded_by', 'name email emp_code')
      .sort({ uploaded_at: -1 });

    res.json({
      count: evidences.length,
      evidences
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get evidence by user
 * GET /api/evidence/user/:userId
 */
export const getEvidenceByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    const evidences = await Evidence.find({ uploaded_by: userId })
      .populate('project_id', 'name')
      .sort({ uploaded_at: -1 });

    res.json({
      count: evidences.length,
      evidences
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get evidence by manager ID
 * GET /api/evidence/manager/:managerId
 */
export const getEvidenceByManager = async (req, res, next) => {
  try {
    const { managerId } = req.params;
    
    const evidences = await Evidence.find({ managerId: managerId })
      .populate('uploaded_by', 'name email emp_code')
      .populate('project_id', 'name description')
      .populate('managerId', 'name email emp_code')
      .sort({ uploaded_at: -1 });

    res.json({
      count: evidences.length,
      managerId: managerId,
      evidences
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete evidence
 * DELETE /api/evidence/:id
 */
export const deleteEvidence = async (req, res, next) => {
  try {
    const evidence = await Evidence.findByIdAndDelete(req.params.id);

    if (!evidence) {
      return res.status(404).json({
        error: 'Evidence not found'
      });
    }

    res.json({
      message: 'Evidence deleted successfully',
      evidence
    });
  } catch (error) {
    next(error);
  }
};