const { body } = require('express-validator');

const strongPassword = body('password')
  .isStrongPassword({ minLength: 8, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
  .withMessage('Password must include uppercase, lowercase, number and symbol.');

const loginRules = [
  body('email').trim().isEmail().withMessage('Valid email is required.'),
  body('password').notEmpty().withMessage('Password is required.'),
];

const forgotPasswordRules = [body('email').trim().isEmail().withMessage('Valid email is required.')];

const resetPasswordRules = [
  body('token').notEmpty().withMessage('Reset token is required.'),
  strongPassword,
];

const changePasswordRules = [
  body('currentPassword').notEmpty().withMessage('Current password is required.'),
  strongPassword,
];

const twoFactorRules = [
  body('challengeId').notEmpty().withMessage('Challenge id is required.'),
  body('code').isLength({ min: 6, max: 6 }).withMessage('A 6 digit verification code is required.'),
];

module.exports = {
  loginRules,
  forgotPasswordRules,
  resetPasswordRules,
  changePasswordRules,
  twoFactorRules,
};
