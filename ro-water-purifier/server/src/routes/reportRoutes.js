const express = require('express');
const controller = require('../controllers/reportController');
const { requirePermission } = require('../middleware/auth');

const router = express.Router();

router.get('/', requirePermission('reports.view'), controller.list);
router.get('/export', requirePermission('reports.view'), controller.download);

module.exports = router;
