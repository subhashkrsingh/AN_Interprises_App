const express = require('express');
const authRoutes = require('./authRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const productRoutes = require('./productRoutes');
const reportRoutes = require('./reportRoutes');
const userRoutes = require('./userRoutes');
const roleRoutes = require('./roleRoutes');
const resourceRouterFactory = require('./resourceRouterFactory');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use('/auth', authRoutes);
router.use(authenticate);
router.use('/dashboard', dashboardRoutes);
router.use('/products', productRoutes);
router.use('/reports', reportRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);

[
  'categories',
  'brands',
  'customers',
  'customer-notes',
  'leads',
  'lead-followups',
  'suppliers',
  'inventory',
  'engineers',
  'engineer-attendance',
  'service-tickets',
  'service-visits',
  'amc-plans',
  'customer-amc',
  'orders',
  'order-items',
  'payments',
  'banners',
  'testimonials',
  'faqs',
  'blogs',
  'website-settings',
  'notifications',
  'settings',
  'invoices',
  'quotations',
  'permissions',
  'user-sessions',
  'login-history',
  'activity-logs',
].forEach((resource) => {
  router.use(`/${resource}`, resourceRouterFactory(resource));
});

module.exports = router;
