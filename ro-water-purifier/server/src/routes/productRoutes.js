const express = require('express');
const controller = require('../controllers/productController');
const { requirePermission } = require('../middleware/auth');
const { imageUpload } = require('../middleware/upload');
const validate = require('../middleware/validate');
const { productRules } = require('../validators/productValidators');

const router = express.Router();

router.get('/', requirePermission('products.view'), controller.list);
router.get('/:id', requirePermission('products.view'), controller.get);
router.post('/', requirePermission('products.create'), imageUpload.array('images', 8), productRules, validate, controller.create);
router.put('/:id', requirePermission('products.edit'), imageUpload.array('images', 8), productRules, validate, controller.update);
router.patch('/:id', requirePermission('products.edit'), imageUpload.array('images', 8), controller.update);
router.patch('/:id/restore', requirePermission('products.edit'), controller.restore);
router.delete('/:id', requirePermission('products.delete'), controller.remove);

module.exports = router;
