const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
const dashboardService = require('../services/dashboardService');

const overview = asyncHandler(async (req, res) => {
  const data = await dashboardService.getDashboardStats();
  success(res, data, 'Dashboard loaded.');
});

module.exports = { overview };
