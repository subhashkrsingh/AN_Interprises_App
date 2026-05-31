const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

const listUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('fullName email mobile username role isEmailVerified createdAt');
    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

const listAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, logs });
  } catch (error) {
    next(error);
  }
};

module.exports = { listUsers, listAuditLogs };
