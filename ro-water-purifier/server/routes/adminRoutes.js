const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roles');
const { listUsers, listAuditLogs } = require('../controllers/adminController');

const router = express.Router();

router.use(authMiddleware, authorizeRoles('Super Admin', 'Admin'));
router.get('/users', listUsers);
router.get('/logs', listAuditLogs);

module.exports = router;
