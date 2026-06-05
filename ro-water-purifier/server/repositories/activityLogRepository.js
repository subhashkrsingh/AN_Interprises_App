const { pool } = require('../config/db');

const mapRowToActivityLog = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    ipAddress: row.ip_address,
    metadata: row.metadata,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const createActivityLog = async ({ userId, type, ipAddress, metadata }) => {
  const { rows } = await pool.query(
    'INSERT INTO activity_logs (user_id, type, ip_address, metadata) VALUES ($1, $2, $3, $4) RETURNING *',
    [userId, type, ipAddress || '', metadata || {}]
  );
  return mapRowToActivityLog(rows[0]);
};

module.exports = { createActivityLog };
