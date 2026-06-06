const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

function flattenAccess(user) {
  const roles = user.roles?.map(({ role }) => role.slug) || [];
  const permissions = [
    ...new Set(
      user.roles?.flatMap(({ role }) =>
        role.permissions?.map(({ permission }) => permission.slug) || []
      ) || []
    ),
  ];

  return { roles, permissions };
}

function signAccessToken(user) {
  const { roles, permissions } = flattenAccess(user);
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      roles,
      permissions,
      type: 'access',
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

function signRefreshToken(user) {
  return jwt.sign({ sub: user.id, type: 'refresh' }, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn,
  });
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function randomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

module.exports = {
  flattenAccess,
  signAccessToken,
  signRefreshToken,
  hashToken,
  randomToken,
};
