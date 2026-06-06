const express = require('express');
const controller = require('../controllers/userController');
const { requirePermission } = require('../middleware/auth');

const router = express.Router();

router.get('/', requirePermission('users.view'), controller.list);
router.get('/:id', requirePermission('users.view'), controller.get);
router.post('/', requirePermission('users.create'), controller.create);
router.put('/:id', requirePermission('users.edit'), controller.update);
router.patch('/:id', requirePermission('users.edit'), controller.update);
router.delete('/:id', requirePermission('users.delete'), controller.remove);

module.exports = router;
