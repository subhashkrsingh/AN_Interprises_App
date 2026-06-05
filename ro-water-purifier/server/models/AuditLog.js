const auditLogRepository = require('../repositories/auditLogRepository');

const mapAuditLog = (row) => ({
  id: row.id,
  userId: row.userId,
  action: row.action,
  ipAddress: row.ipAddress,
  userAgent: row.userAgent,
  metadata: row.metadata,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

const AuditLog = {
  create: async (data) => mapAuditLog(await auditLogRepository.createAuditLog(data)),
  find: () => {
    const query = {
      orderBy: 'created_at DESC',
      limitValue: null,
      sort(sortObject) {
        if (sortObject && sortObject.createdAt === -1) {
          this.orderBy = 'created_at DESC';
        }
        return this;
      },
      limit(count) {
        this.limitValue = count;
        return this;
      },
      async exec() {
        const rows = await auditLogRepository.findAuditLogs({ orderBy: this.orderBy, limit: this.limitValue || 100 });
        return rows.map(mapAuditLog);
      },
      then(resolve, reject) {
        return this.exec().then(resolve, reject);
      },
      catch(reject) {
        return this.exec().catch(reject);
      },
    };
    return query;
  },
};

module.exports = AuditLog;
