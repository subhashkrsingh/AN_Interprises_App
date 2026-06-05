const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

const userColumns = [
  'id',
  'full_name',
  'email',
  'username',
  'mobile',
  'password',
  'role',
  'avatar',
  'address',
  'city',
  'state',
  'pin_code',
  'is_email_verified',
  'email_verify_token',
  'password_reset_token',
  'password_reset_expires',
  'otp_code',
  'otp_expires',
  'google_id',
  'last_login_at',
  'created_at',
  'updated_at',
];

const mapRowToUser = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    _id: row.id,
    fullName: row.full_name,
    email: row.email,
    username: row.username,
    mobile: row.mobile,
    password: row.password,
    role: row.role,
    avatar: row.avatar,
    address: row.address,
    city: row.city,
    state: row.state,
    pinCode: row.pin_code,
    isEmailVerified: row.is_email_verified,
    emailVerifyToken: row.email_verify_token,
    passwordResetToken: row.password_reset_token,
    passwordResetExpires: row.password_reset_expires,
    otpCode: row.otp_code,
    otpExpires: row.otp_expires,
    googleId: row.google_id,
    lastLoginAt: row.last_login_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const toSnakeCase = (key) => {
  const map = {
    fullName: 'full_name',
    pinCode: 'pin_code',
    isEmailVerified: 'is_email_verified',
    emailVerifyToken: 'email_verify_token',
    passwordResetToken: 'password_reset_token',
    passwordResetExpires: 'password_reset_expires',
    otpCode: 'otp_code',
    otpExpires: 'otp_expires',
    googleId: 'google_id',
    lastLoginAt: 'last_login_at',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  };
  return map[key] || key;
};

const buildFilterClause = (filters) => {
  const clauses = [];
  const values = [];

  if (!filters || Object.keys(filters).length === 0) {
    return { clauses, values };
  }

  if (filters.$or && Array.isArray(filters.$or)) {
    const orClauses = filters.$or.map((condition) => {
      const key = Object.keys(condition)[0];
      const value = condition[key];
      const column = toSnakeCase(key);
      values.push(value);
      if (['email', 'username'].includes(key)) {
        return `LOWER(${column}) = LOWER($${values.length})`;
      }
      return `${column} = $${values.length}`;
    });
    clauses.push(`(${orClauses.join(' OR ')})`);
  }

  Object.entries(filters).forEach(([key, value]) => {
    if (key === '$or') return;

    if (key === 'passwordResetExpires' && value && value.$gt) {
      values.push(value.$gt);
      clauses.push(`password_reset_expires > $${values.length}`);
      return;
    }

    if (key === 'id' || key === '_id') {
      values.push(Number(value));
      clauses.push(`id = $${values.length}`);
      return;
    }

    const column = toSnakeCase(key);
    if (['email', 'username'].includes(key)) {
      values.push(value.toString().toLowerCase());
      clauses.push(`LOWER(${column}) = LOWER($${values.length})`);
      return;
    }

    values.push(value);
    clauses.push(`${column} = $${values.length}`);
  });

  return { clauses, values };
};

const getRefreshTokens = async (userId) => {
  const { rows } = await pool.query(
    'SELECT token, created_at FROM refresh_tokens WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return rows.map((row) => ({ token: row.token, createdAt: row.created_at }));
};

const findOne = async (filters, options = {}) => {
  const { clauses, values } = buildFilterClause(filters);
  const selectPassword = options.includePassword ? ', password' : '';
  const sql = `SELECT ${userColumns.filter((column) => column !== 'password').join(', ')}${selectPassword} FROM users ${
    clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''
  } LIMIT 1`;
  const { rows } = await pool.query(sql, values);
  const user = mapRowToUser(rows[0]);
  if (!user) return null;
  if (options.includeRefreshTokens) {
    user.refreshTokens = await getRefreshTokens(user.id);
  }
  return user;
};

const findMany = async () => {
  const sql = `SELECT ${userColumns.filter((column) => column !== 'password').join(', ')} FROM users ORDER BY created_at DESC`;
  const { rows } = await pool.query(sql);
  return rows.map(mapRowToUser);
};

const hashPassword = async (password) => bcrypt.hash(password, 10);

const createUser = async (data) => {
  const email = data.email ? data.email.toString().trim().toLowerCase() : null;
  const username = data.username ? data.username.toString().trim().toLowerCase() : null;
  const password = await hashPassword(data.password);
  const result = await pool.query(
    `INSERT INTO users (
      full_name,
      email,
      username,
      mobile,
      password,
      role,
      avatar,
      address,
      city,
      state,
      pin_code,
      is_email_verified,
      email_verify_token,
      password_reset_token,
      password_reset_expires,
      otp_code,
      otp_expires,
      google_id,
      last_login_at
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19) RETURNING *`,
    [
      data.fullName,
      email,
      username,
      data.mobile,
      password,
      data.role || 'Customer',
      data.avatar || '',
      data.address || '',
      data.city || '',
      data.state || '',
      data.pinCode || '',
      data.isEmailVerified || false,
      data.emailVerifyToken || null,
      data.passwordResetToken || null,
      data.passwordResetExpires || null,
      data.otpCode || null,
      data.otpExpires || null,
      data.googleId || '',
      data.lastLoginAt || new Date(),
    ]
  );
  return mapRowToUser(result.rows[0]);
};

const updateUser = async (id, updates) => {
  const setClauses = [];
  const values = [];

  const applyUpdate = (key, value) => {
    const column = toSnakeCase(key);
    values.push(value === undefined ? null : value);
    setClauses.push(`${column} = $${values.length}`);
  };

  if (updates.password) {
    updates.password = await hashPassword(updates.password);
  }

  if (updates.email) {
    updates.email = updates.email.toString().trim().toLowerCase();
  }

  if (updates.username) {
    updates.username = updates.username.toString().trim().toLowerCase();
  }

  const allowedFields = [
    'fullName',
    'email',
    'username',
    'mobile',
    'password',
    'role',
    'avatar',
    'address',
    'city',
    'state',
    'pinCode',
    'isEmailVerified',
    'emailVerifyToken',
    'passwordResetToken',
    'passwordResetExpires',
    'otpCode',
    'otpExpires',
    'googleId',
    'lastLoginAt',
  ];

  allowedFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(updates, field)) {
      applyUpdate(field, updates[field]);
    }
  });

  if (setClauses.length === 0) {
    return findOne({ id });
  }

  values.push(Number(id));
  const sql = `UPDATE users SET ${setClauses.join(', ')}, updated_at = now() WHERE id = $${values.length} RETURNING *`;
  const { rows } = await pool.query(sql, values);
  return mapRowToUser(rows[0]);
};

const deleteUser = async (id) => {
  await pool.query('DELETE FROM users WHERE id = $1', [Number(id)]);
};

const addRefreshToken = async (userId, token) => {
  await pool.query('INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2) ON CONFLICT DO NOTHING', [Number(userId), token]);
};

const removeRefreshToken = async (token) => {
  await pool.query('DELETE FROM refresh_tokens WHERE token = $1', [token]);
};

module.exports = {
  findOne,
  findMany,
  findById: async (id, options = {}) => findOne({ id }, options),
  createUser,
  updateUser,
  deleteUser,
  addRefreshToken,
  removeRefreshToken,
};
