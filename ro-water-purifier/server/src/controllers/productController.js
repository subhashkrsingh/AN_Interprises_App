const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
const createCrudController = require('./crudController');
const productService = require('../services/productService');
const { logActivity } = require('../services/activityLogService');

const base = createCrudController('products');

const create = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body, req.files || []);
  await logActivity(req, { module: 'products', action: 'create', entity: 'product', entityId: product.id });
  success(res, product, 'Product created.', 201);
});

const update = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body, req.files || []);
  await logActivity(req, { module: 'products', action: 'update', entity: 'product', entityId: product.id });
  success(res, product, 'Product updated.');
});

const remove = asyncHandler(async (req, res) => {
  await productService.softDeleteProduct(req.params.id);
  await logActivity(req, { module: 'products', action: 'delete', entity: 'product', entityId: req.params.id });
  success(res, null, 'Product archived.');
});

const restore = asyncHandler(async (req, res) => {
  const product = await productService.restoreProduct(req.params.id);
  await logActivity(req, { module: 'products', action: 'restore', entity: 'product', entityId: product.id });
  success(res, product, 'Product restored.');
});

module.exports = {
  ...base,
  create,
  update,
  remove,
  restore,
};
