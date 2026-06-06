const prisma = require('../config/prisma');
const logger = require('../config/logger');

async function logActivity(req, { module, action, entity, entityId, metadata } = {}) {
  try {
    await prisma.activityLog.create({
      data: {
        userId: req.user?.id,
        module: module || 'system',
        action: action || req.method,
        entity,
        entityId,
        metadata,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      },
    });
  } catch (error) {
    logger.warn('Activity log failed', { error: error.message });
  }
}

module.exports = { logActivity };
