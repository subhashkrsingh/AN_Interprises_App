const express = require('express');
const createCrudController = require('../controllers/crudController');
const { requirePermission } = require('../middleware/auth');

function resourceRouterFactory(resource) {
  const router = express.Router();
  const controller = createCrudController(resource);
  const permissionAliases = {
    'cms-pages': 'cms',
    'inventory-logs': 'inventory',
    'activity-logs': 'activity_logs',
  };
  const permissionModule = permissionAliases[resource] || resource.replace(/-/g, '_');

  router.get('/', requirePermission(`${permissionModule}.view`), controller.list);
  router.get('/:id', requirePermission(`${permissionModule}.view`), controller.get);
  router.post('/', requirePermission(`${permissionModule}.create`), controller.create);
  router.put('/:id', requirePermission(`${permissionModule}.edit`), controller.update);
  router.patch('/:id', requirePermission(`${permissionModule}.edit`), controller.update);
  router.patch('/:id/restore', requirePermission(`${permissionModule}.edit`), controller.restore);
  router.delete('/:id', requirePermission(`${permissionModule}.delete`), controller.remove);

  return router;
}

module.exports = resourceRouterFactory;
