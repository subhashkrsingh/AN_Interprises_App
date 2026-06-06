const logger = require('../config/logger');
const env = require('../config/env');

function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || error.status || 500;

  logger.error(error.message, {
    statusCode,
    path: req.originalUrl,
    method: req.method,
    stack: error.stack,
  });

  return res.status(statusCode).json({
    success: false,
    message: statusCode === 500 && env.nodeEnv === 'production' ? 'Internal server error.' : error.message,
    ...(env.nodeEnv !== 'production' ? { stack: error.stack } : {}),
  });
}

module.exports = errorHandler;
