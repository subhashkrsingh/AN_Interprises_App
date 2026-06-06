const jwt = require('jsonwebtoken');
const env = require('../config/env');
const userRepository = require('../repositories/userRepository');
const { flattenAccess } = require('../utils/tokens');

async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authorization token required.' });
    }

    const token = header.slice(7);
    const decoded = jwt.verify(token, env.jwtSecret);
    if (decoded.type !== 'access') {
      return res.status(401).json({ success: false, message: 'Invalid token type.' });
    }

    const user = await userRepository.findById(decoded.sub);
    if (!user || user.status !== 'ACTIVE') {
      return res.status(401).json({ success: false, message: 'User is not active.' });
    }

    const { roles, permissions } = flattenAccess(user);
    req.user = {
      id: user.id,
      email: user.email,
      roles,
      permissions,
    };
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const hasRole = req.user?.roles?.some((role) => allowedRoles.includes(role));
    if (!hasRole) return res.status(403).json({ success: false, message: 'Forbidden.' });
    next();
  };
}

function requirePermission(permission) {
  return (req, res, next) => {
    if (req.user?.roles?.includes('super-admin') || req.user?.permissions?.includes(permission)) {
      return next();
    }

    return res.status(403).json({ success: false, message: 'Permission denied.' });
  };
}

module.exports = { authenticate, authorizeRoles, requirePermission };
