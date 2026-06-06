const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
const roleService = require('../services/roleService');
const { logActivity } = require('../services/activityLogService');

const list = asyncHandler(async (req, res) => {
  const data = await roleService.listRoles(req.query);
  success(res, data.items, 'Roles loaded.', 200, data.pagination);
});

const get = asyncHandler(async (req, res) => {
  const data = await roleService.getRole(req.params.id);
  success(res, data, 'Role loaded.');
});

const create = asyncHandler(async (req, res) => {
  const data = await roleService.createRole(req.body);
  await logActivity(req, { module: 'roles', action: 'create', entity: 'role', entityId: data.id });
  success(res, data, 'Role created.', 201);
});

const update = asyncHandler(async (req, res) => {
  const data = await roleService.updateRole(req.params.id, req.body);
  await logActivity(req, { module: 'roles', action: 'update', entity: 'role', entityId: data.id });
  success(res, data, 'Role updated.');
});

const remove = asyncHandler(async (req, res) => {
  await roleService.removeRole(req.params.id);
  await logActivity(req, { module: 'roles', action: 'delete', entity: 'role', entityId: req.params.id });
  success(res, null, 'Role deleted.');
});

module.exports = { list, get, create, update, remove };
