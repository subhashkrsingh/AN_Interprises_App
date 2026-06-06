const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
const resourceService = require('../services/resourceService');
const { logActivity } = require('../services/activityLogService');

function createCrudController(resource) {
  return {
    list: asyncHandler(async (req, res) => {
      const data = await resourceService.list(resource, req.query);
      success(res, data.items, 'Records loaded.', 200, data.pagination);
    }),
    get: asyncHandler(async (req, res) => {
      const data = await resourceService.get(resource, req.params.id);
      success(res, data, 'Record loaded.');
    }),
    create: asyncHandler(async (req, res) => {
      const data = await resourceService.create(resource, req.body);
      await logActivity(req, { module: resource, action: 'create', entity: resource, entityId: data.id });
      success(res, data, 'Record created.', 201);
    }),
    update: asyncHandler(async (req, res) => {
      const data = await resourceService.update(resource, req.params.id, req.body);
      await logActivity(req, { module: resource, action: 'update', entity: resource, entityId: req.params.id });
      success(res, data, 'Record updated.');
    }),
    remove: asyncHandler(async (req, res) => {
      await resourceService.remove(resource, req.params.id);
      await logActivity(req, { module: resource, action: 'delete', entity: resource, entityId: req.params.id });
      success(res, null, 'Record deleted.');
    }),
    restore: asyncHandler(async (req, res) => {
      const data = await resourceService.restore(resource, req.params.id);
      await logActivity(req, { module: resource, action: 'restore', entity: resource, entityId: req.params.id });
      success(res, data, 'Record restored.');
    }),
  };
}

module.exports = createCrudController;
