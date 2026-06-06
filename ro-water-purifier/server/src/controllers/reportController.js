const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
const reportService = require('../services/reportService');

const list = asyncHandler(async (req, res) => {
  const data = await reportService.getReport(req.query.type);
  success(res, data, 'Report generated.');
});

const download = asyncHandler(async (req, res) => {
  const { mimeType, extension, body } = await reportService.exportReport(req.query.type, req.query.format);
  res.setHeader('Content-Type', mimeType);
  res.setHeader('Content-Disposition', `attachment; filename="${req.query.type || 'report'}.${extension || 'json'}"`);
  res.send(body);
});

module.exports = { list, download };
