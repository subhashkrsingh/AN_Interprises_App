const activityLogRepository = require('../repositories/activityLogRepository');

const mapActivityLog = (row) => ({
  id: row.id,
  userId: row.userId,
  type: row.type,
  ipAddress: row.ipAddress,
  metadata: row.metadata,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

const ActivityLog = {
  create: async (data) => mapActivityLog(await activityLogRepository.createActivityLog(data)),
};

module.exports = ActivityLog;
