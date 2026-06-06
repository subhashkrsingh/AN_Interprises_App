const express = require('express');
const { overview } = require('../controllers/dashboardController');
const { requirePermission } = require('../middleware/auth');

const router = express.Router();

router.get('/', requirePermission('dashboard.view'), overview);

module.exports = router;
