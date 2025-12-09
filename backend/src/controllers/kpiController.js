import Kpi from '../models/Kpis.js';
import User from '../models/User.js';
import Project from '../models/Project.js';

/**
 * KPI Controller
 * Handles KPI creation and management
 */

/**
 * Create or Update KPI
 * POST /api/kpis
 * 
 * req.body = {
 *   user_id: string (required) - User ID
 *   period: string (required) - "2025-12" format
 *   projectId: string (required) - Project ID
 *   kpiData: object (required) - JSON object with KPI codes and values
 *     Example: {
 *       "parameter1": [75, 78, 76, 74, 77],
 *       "parameter2": [15, 12, 10, 18, 13],
 *       ...
 *     }
 * }
 */
export const createKpi = async (req, res, next) => {
  try {
    const {
      user_id,
      period,
      projectId,
      kpiData
    } = req.body;

    // Validate required fields
    if (!user_id || !period || !projectId || !kpiData) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['user_id', 'period', 'projectId', 'kpiData']
      });
    }

    // Validate kpiData is an object
    if (typeof kpiData !== 'object' || Array.isArray(kpiData)) {
      return res.status(400).json({
        error: 'Invalid kpiData format',
        message: 'kpiData must be an object with parameter names as keys and arrays as values'
      });
    }

    // Validate user exists
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Validate project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        error: 'Project not found'
      });
    }

    // Store each parameter with its values array
    const kpisArray = [];
    
    for (const [parameterName, values] of Object.entries(kpiData)) {
      // Validate that values is an array
      if (!Array.isArray(values)) {
        return res.status(400).json({
          error: `Invalid data for ${parameterName}`,
          message: 'Each parameter must have an array of numeric values'
        });
      }

      kpisArray.push({
        kpi_code: parameterName,  // parameter1, parameter2, etc.
        computedValues: values     // Store the entire array [75, 78, 76, 74, 77]
      });
    }

    // Find existing KPI document for this user, period, and project
    let kpiDoc = await Kpi.findOne({
      user_id,
      period,
      projectId
    });

    if (kpiDoc) {
      // Update existing KPI document
      // Replace all KPIs with new ones from Gemini
      kpiDoc.kpis = kpisArray;
      kpiDoc.updated_at = new Date();
      await kpiDoc.save();
    } else {
      // Create new KPI document
      kpiDoc = await Kpi.create({
        user_id,
        period,
        projectId,
        kpis: kpisArray
      });
    }

    // Populate the response
    const populatedKpi = await Kpi.findById(kpiDoc._id)
      .populate('user_id', 'name email emp_code')
      .populate('projectId', 'name description');

    res.status(201).json({
      message: 'KPI created/updated successfully',
      kpi: populatedKpi,
      processedParameters: Object.keys(geminiResponse).length
    });
  } catch (error) {
    console.error('Create KPI error:', error);
    next(error);
  }
};
