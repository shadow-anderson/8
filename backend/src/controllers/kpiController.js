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
 *   pdfUrl: string (required) - PDF URL to process with Gemini
 * }
 * 
 * Gemini response format:
 * {
 *   "parameter1": [45, 46, 47, 44, 45],
 *   "parameter2": [78, 79, 77, 76, 75],
 *   ...
 * }
 */
export const createKpi = async (req, res, next) => {
  try {
    const {
      user_id,
      period,
      projectId,
      pdfUrl
    } = req.body;

    // Validate required fields
    if (!user_id || !period || !projectId || !pdfUrl) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['user_id', 'period', 'projectId', 'pdfUrl']
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

    // TODO: Call Gemini API with pdfUrl
    // For now, using placeholder - replace this with your Gemini API call
    // const geminiResponse = await callGeminiAPI(pdfUrl);
    
    // Placeholder response (replace with actual Gemini call)
    const geminiResponse = {
      "parameter1": [45, 46, 47, 44, 45],
      "parameter2": [78, 79, 77, 76, 75],
      "parameter3": [18, 17, 19, 16, 20],
      "parameter4": [98, 97, 99, 98, 96],
      "parameter5": [65, 66, 67, 64, 68]
    };

    // Store each parameter with its values array
    const kpisArray = [];
    
    for (const [parameterName, values] of Object.entries(geminiResponse)) {
      kpisArray.push({
        kpi_code: parameterName,  // parameter1, parameter2, etc.
        computedValues: values     // Store the entire array [45, 46, 47, 44, 45]
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
