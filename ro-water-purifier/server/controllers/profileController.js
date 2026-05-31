const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

const normalizeUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  username: user.username,
  mobile: user.mobile,
  role: user.role,
  avatar: user.avatar,
  address: user.address,
  city: user.city,
  state: user.state,
  pinCode: user.pinCode,
  isEmailVerified: user.isEmailVerified,
  lastLoginAt: user.lastLoginAt,
});

const updateProfile = async (req, res, next) => {
  try {
    const { fullName, address, city, state, pinCode, avatar } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.fullName = fullName || user.fullName;
    user.address = address || user.address;
    user.city = city || user.city;
    user.state = state || user.state;
    user.pinCode = pinCode || user.pinCode;
    user.avatar = avatar || user.avatar;
    await user.save();

    await AuditLog.create({ userId: user._id, action: 'profile_update', ipAddress: req.ip, userAgent: req.get('User-Agent') || '' });
    res.json({ success: true, message: 'Profile updated successfully.', user: normalizeUser(user) });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');
    if (!user || !(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    }

    user.password = newPassword;
    await user.save();
    await AuditLog.create({ userId: user._id, action: 'change_password', ipAddress: req.ip, userAgent: req.get('User-Agent') || '' });
    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    next(error);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    await user.deleteOne();
    await AuditLog.create({ userId: req.user.id, action: 'delete_account', ipAddress: req.ip, userAgent: req.get('User-Agent') || '' });
    res.json({ success: true, message: 'Account deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { updateProfile, changePassword, deleteAccount };
