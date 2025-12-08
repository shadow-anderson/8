// Date and time utility functions

// Get date range for a period (weekly, monthly, quarterly)
exports.getDateRange = (period) => {
  const now = new Date();
  let startDate;

  switch (period) {
    case 'weekly':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'monthly':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case 'quarterly':
      startDate = new Date(now.setMonth(now.getMonth() - 3));
      break;
    default:
      startDate = new Date(now.setDate(now.getDate() - 30));
  }

  return { startDate, endDate: new Date() };
};

// Format date for display
exports.formatDate = (date, format = 'YYYY-MM-DD') => {
  // return formatted date string
};

// Check if date is within range
exports.isDateInRange = (date, startDate, endDate) => {
  return date >= startDate && date <= endDate;
};
