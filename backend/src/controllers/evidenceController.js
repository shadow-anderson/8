const Evidence = require('../models/Evidence');
const { AppError } = require('../middleware/errorHandler');

/**
 * Evidence Controller
 * Handles operations related to evidence management
 */

/**
 * Upload new evidence
 * POST /api/evidence
 * Body: { title, description, fileUrl, relatedTaskId }
 * req.body = {
 *   title: string (required),
 *   description: string (optional),
 *   fileUrl: string (required),
 *   relatedTaskId: string (optional)
 * }
 */
exports.uploadEvidence = async (req, res, next) => {
  try {
    const { title, description, fileUrl, projectId } = req.body;

    // Validate required fields
    if (!title || !fileUrl) {
      return next(new AppError('Missing required fields: title and fileUrl', 400));
    }

    // Create new evidence
    const newEvidence = new Evidence({
      title,
      description,
      fileUrl,
      projectId: projectId || null
    });

    await newEvidence.save();

    res.status(201).json({
      message: 'Evidence uploaded successfully',
      evidence: newEvidence
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get evidence by project ID
 * GET /api/evidence/project/:projectId
 */
exports.getEvidenceByProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const evidences = await Evidence.find({ projectId });

    res.status(200).json({
      evidences
    });
  } catch (error) {
    next(error);
  }     
}