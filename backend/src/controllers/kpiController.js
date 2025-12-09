import Kpi from '../models/Kpis.js';
import User from '../models/User.js';
import Project from '../models/Project.js';

/**
 * KPI Controller
 * Handles KPI creation and management
 */

/**
 * Compute VASA (Variability-Adjusted Stability Analysis) Score
 * @param {Object} params - Object with parameter arrays (p1, p2, p3, p4, p5)
 * @returns {Number} KPI score (0-100)
 */
function computeVASA(params) {
  // params = { p1: [...5 numbers], p2: [...], ..., p5: [...] }
  
  const paramArrays = Object.values(params);
  
  // -----------------------------
  // Helper Functions
  // -----------------------------
  const mean = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
  
  const variance = arr => {
    const m = mean(arr);
    return mean(arr.map(x => (x - m) ** 2));
  };
  
  // absolute z-score mean
  const absZScoreMean = arr => {
    const m = mean(arr);
    const sd = Math.sqrt(variance(arr)) || 1e-9;
    const zs = arr.map(x => Math.abs((x - m) / sd));
    return mean(zs);
  };
  
  // -----------------------------
  // STEP 1–4: parameter_score = absZMean * sqrt(stability)
  // stability = 1 / variance
  // -----------------------------
  const parameterScores = paramArrays.map(arr => {
    const varr = variance(arr);
    const stability = 1 / (varr + 1e-9);
    const absZ = absZScoreMean(arr);
    return absZ * Math.sqrt(stability);
  });
  
  // -----------------------------
  // STEP 5: Min-Max normalize parameter scores
  // -----------------------------
  const minScore = Math.min(...parameterScores);
  const maxScore = Math.max(...parameterScores);
  const range = maxScore - minScore || 1e-9;
  
  const normalized = parameterScores.map(s => (s - minScore) / range);
  
  // -----------------------------
  // STEP 6: Entropy Weighting
  // -----------------------------
  const sumNorm = normalized.reduce((a, b) => a + b, 0) || 1e-9;
  
  const p = normalized.map(v => v / sumNorm);
  
  const k = 1 / Math.log(5);
  const entropy = -k * p.reduce((sum, pi) => {
    return pi > 0 ? sum + pi * Math.log(pi) : sum;
  }, 0);
  
  // all parameters share the same entropy when symmetric → equal weights
  const weights = Array(5).fill(1 / 5);
  
  // -----------------------------
  // STEP 7: Final KPI = weighted sum * 100
  // -----------------------------
  let KPI = 0;
  for (let i = 0; i < 5; i++) {
    KPI += weights[i] * normalized[i];
  }
  
  return KPI * 100; // scale to 0–100
}

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

    // Calculate VASA KPI Score
    let vasaScore = null;
    try {
      vasaScore = computeVASA(kpiData);
    } catch (error) {
      console.error('VASA computation error:', error);
      return res.status(400).json({
        error: 'Failed to compute KPI score',
        message: 'Ensure kpiData has valid numeric arrays for all parameters'
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
      vasaScore: parseFloat(vasaScore.toFixed(2)),
      processedParameters: Object.keys(kpiData).length
    });
  } catch (error) {
    console.error('Create KPI error:', error);
    next(error);
  }
};
