// KPI calculation utility functions

// Calculate KPI value based on type and data
exports.calculateKpiValue = (kpi, data) => {
  // Different calculation methods based on KPI type
  // switch (kpi.calculationType) {
  //   case 'percentage':
  //     return (data.achieved / data.target) * 100;
  //   case 'count':
  //     return data.count;
  //   case 'average':
  //     return data.total / data.count;
  //   case 'sum':
  //     return data.total;
  //   default:
  //     return 0;
  // }
};

// Calculate weighted score
exports.calculateWeightedScore = (scores, weights) => {
  // let totalScore = 0;
  // let totalWeight = 0;
  // scores.forEach((score, index) => {
  //   totalScore += score * weights[index];
  //   totalWeight += weights[index];
  // });
  // return totalScore / totalWeight;
};

// Normalize KPI values to 0-100 scale
exports.normalizeKpiValue = (value, min, max) => {
  // return ((value - min) / (max - min)) * 100;
};
