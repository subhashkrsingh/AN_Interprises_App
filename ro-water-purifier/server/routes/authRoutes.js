const express = require('express');
const { body, validationResult } = require('express-validator');
const { authLimiter } = require('../middleware/rateLimiter');
const {
  register,
  login,
  refreshToken,
  logout,
  me,
  sendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
  googleAuth,
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
  }
  next();
};

router.post(
  '/register',
  authLimiter,
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required.'),
    body('email').trim().isEmail().withMessage('Enter a valid email address.'),
    body('mobile').trim().matches(/^[6-9]\d{9}$/).withMessage('Enter a valid 10-digit Indian mobile number.'),
    body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters.'),
    body('password')
      .isStrongPassword({ minLength: 8, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
      .withMessage('Password must be strong and include uppercase, lowercase, number and special character.'),
  ],
  handleValidation,
  register
);

router.post('/login', authLimiter, [body('identifier').trim().notEmpty(), body('password').notEmpty()], handleValidation, login);
router.post('/google', authLimiter, [body('credential').notEmpty().withMessage('Google credential is required.')], handleValidation, googleAuth);
router.post('/send-otp', authLimiter, [body('mobile').trim().matches(/^[6-9]\d{9}$/).withMessage('Enter a valid Indian mobile number.')], handleValidation, sendOtp);
router.post('/verify-otp', authLimiter, [body('mobile').trim().matches(/^[6-9]\d{9}$/).withMessage('Enter a valid Indian mobile number.'), body('otp').trim().isLength({ min: 6, max: 6 }).withMessage('Enter a 6-digit OTP.')], handleValidation, verifyOtp);
router.post('/forgot-password', authLimiter, [body('email').trim().isEmail().withMessage('Enter a valid email address.')], handleValidation, forgotPassword);
router.post('/reset-password', authLimiter, [body('token').notEmpty().withMessage('Reset token is required.'), body('password').isStrongPassword({ minLength: 8, minUppercase: 1, minNumbers: 1, minSymbols: 1 }).withMessage('Password must be strong.')], handleValidation, resetPassword);
router.post('/logout', authLimiter, logout);
router.post('/refresh', refreshToken);
router.get('/me', authMiddleware, me);

module.exports = router;
