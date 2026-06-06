const express = require('express');
const rateLimit = require('express-rate-limit');
const controller = require('../controllers/authController');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const {
  loginRules,
  forgotPasswordRules,
  resetPasswordRules,
  changePasswordRules,
  twoFactorRules,
} = require('../validators/authValidators');

const router = express.Router();
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 50 });

router.post('/login', authLimiter, loginRules, validate, controller.login);
router.post('/2fa/verify', authLimiter, twoFactorRules, validate, controller.verifyTwoFactor);
router.post('/refresh', controller.refresh);
router.post('/forgot-password', authLimiter, forgotPasswordRules, validate, controller.forgotPassword);
router.post('/reset-password', authLimiter, resetPasswordRules, validate, controller.resetPassword);
router.post('/logout', authenticate, controller.logout);
router.get('/me', authenticate, controller.me);
router.patch('/change-password', authenticate, changePasswordRules, validate, controller.changePassword);
router.post('/2fa/enable', authenticate, controller.enableTwoFactor);
router.post('/2fa/disable', authenticate, controller.disableTwoFactor);

module.exports = router;
