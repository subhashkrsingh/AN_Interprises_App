const express = require('express');
const controller = require('../controllers/roleController');
const { requirePermission } = require('../middleware/auth');

const router = express.Router();

router.get('/', requirePermission('roles.view'), controller.list);
router.get('/:id', requirePermission('roles.view'), controller.get);
router.post('/', requirePermission('roles.create'), controller.create);
router.put('/:id', requirePermission('roles.edit'), controller.update);
router.patch('/:id', requirePermission('roles.edit'), controller.update);
router.delete('/:id', requirePermission('roles.delete'), controller.remove);

module.exports = router;
