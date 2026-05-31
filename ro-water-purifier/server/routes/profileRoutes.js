const express = require('express');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const { updateProfile, changePassword, deleteAccount } = require('../controllers/profileController');

const router = express.Router();

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
  }
  next();
};

router.use(authMiddleware);
router.put('/update', [body('fullName').optional().trim(), body('address').optional().trim(), body('city').optional().trim(), body('state').optional().trim(), body('pinCode').optional().trim().isLength({ min: 6, max: 6 }).withMessage('PIN code must be 6 digits.'), body('avatar').optional().isURL().withMessage('Avatar URL must be valid.')], handleValidation, updateProfile);
router.put('/change-password', [body('currentPassword').notEmpty().withMessage('Current password is required.'), body('newPassword').isStrongPassword({ minLength: 8, minUppercase: 1, minNumbers: 1, minSymbols: 1 }).withMessage('New password must be strong.')], handleValidation, changePassword);
router.delete('/delete', deleteAccount);

module.exports = router;
