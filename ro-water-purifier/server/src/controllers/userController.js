const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
const userService = require('../services/userService');
const { logActivity } = require('../services/activityLogService');

const list = asyncHandler(async (req, res) => {
  const data = await userService.listUsers(req.query);
  success(res, data.items, 'Users loaded.', 200, data.pagination);
});

const get = asyncHandler(async (req, res) => {
  const data = await userService.getUser(req.params.id);
  success(res, data, 'User loaded.');
});

const create = asyncHandler(async (req, res) => {
  const data = await userService.createUser(req.body);
  await logActivity(req, { module: 'users', action: 'create', entity: 'user', entityId: data.id });
  success(res, data, 'User created.', 201);
});

const update = asyncHandler(async (req, res) => {
  const data = await userService.updateUser(req.params.id, req.body);
  await logActivity(req, { module: 'users', action: 'update', entity: 'user', entityId: data.id });
  success(res, data, 'User updated.');
});

const remove = asyncHandler(async (req, res) => {
  await userService.removeUser(req.params.id);
  await logActivity(req, { module: 'users', action: 'delete', entity: 'user', entityId: req.params.id });
  success(res, null, 'User disabled.');
});

module.exports = { list, get, create, update, remove };
