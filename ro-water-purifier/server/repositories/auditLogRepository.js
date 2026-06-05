const { pool } = require('../config/db');

const mapRowToAuditLog = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    action: row.action,
    ipAddress: row.ip_address,
    userAgent: row.user_agent,
    metadata: row.metadata,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const createAuditLog = async ({ userId, action, ipAddress, userAgent, metadata }) => {
  const { rows } = await pool.query(
    'INSERT INTO audit_logs (user_id, action, ip_address, user_agent, metadata) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [userId || null, action, ipAddress || '', userAgent || '', metadata || {}]
  );
  return mapRowToAuditLog(rows[0]);
};

const findAuditLogs = async ({ orderBy = 'created_at DESC', limit = 100 } = {}) => {
  const sql = `SELECT * FROM audit_logs ORDER BY ${orderBy} LIMIT $1`;
  const { rows } = await pool.query(sql, [limit]);
  return rows.map(mapRowToAuditLog);
};

module.exports = { createAuditLog, findAuditLogs };
