const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

const createToken = (payload, secret, expiresIn) => jwt.sign(payload, secret, { expiresIn });

const createAccessToken = (user) => createToken({ id: user._id, role: user.role }, process.env.JWT_SECRET, '15m');
const createRefreshToken = (user) => createToken({ id: user._id, role: user.role }, process.env.JWT_REFRESH_SECRET, '30d');

const sendRefreshCookie = (res, token, remember) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: remember ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
  });
};

const clearRefreshCookie = (res) => {
  res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
};

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

const logAction = async (userId, action, req, metadata = {}) => {
  try {
    await AuditLog.create({ userId, action, ipAddress: req.ip, userAgent: req.get('User-Agent') || '', metadata });
  } catch (error) {
    console.error('Audit log failed:', error.message);
  }
};

const generateRandomOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const register = async (req, res, next) => {
  try {
    const { fullName, email, mobile, username, password } = req.body;

    if (!fullName || !email || !mobile || !username || !password) {
      return res.status(422).json({ success: false, message: 'All fields are required.' });
    }

    const existing = await User.findOne({ $or: [{ email }, { username }, { mobile }] });
    if (existing) {
      return res.status(409).json({ success: false, message: 'A user already exists with that email, username, or mobile number.' });
    }

    const user = await User.create({ fullName, email, mobile, username, password, role: 'Customer' });
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    await user.addRefreshToken(refreshToken);

    sendRefreshCookie(res, refreshToken, true);
    await logAction(user._id, 'register', req, { provider: 'email' });

    res.json({ success: true, message: 'Registration successful.', user: normalizeUser(user), accessToken });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { identifier, password, rememberMe } = req.body;

    if (!identifier || !password) {
      return res.status(422).json({ success: false, message: 'Identifier and password are required.' });
    }

    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { username: identifier.toLowerCase() }, { mobile: identifier }],
    }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Email, username or password is incorrect.' });
    }

    user.lastLoginAt = new Date();
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    await user.addRefreshToken(refreshToken);
    await user.save();

    sendRefreshCookie(res, refreshToken, rememberMe === true);
    await logAction(user._id, 'login', req, { method: 'password' });

    res.json({ success: true, user: normalizeUser(user), accessToken });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ success: false, message: 'Refresh token required.' });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || !user.refreshTokens.some((rt) => rt.token === token)) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token.' });
    }

    const accessToken = createAccessToken(user);
    const refreshTokenValue = createRefreshToken(user);
    await user.removeRefreshToken(token);
    await user.addRefreshToken(refreshTokenValue);
    sendRefreshCookie(res, refreshTokenValue, true);

    res.json({ success: true, accessToken, user: normalizeUser(user) });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Refresh failed. Please log in again.' });
  }
};

const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.id);
      if (user) {
        await user.removeRefreshToken(token);
        await logAction(user._id, 'logout', req);
      }
    }

    clearRefreshCookie(res);
    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    clearRefreshCookie(res);
    res.json({ success: true, message: 'Logged out successfully.' });
  }
};

const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, user: normalizeUser(user) });
  } catch (error) {
    next(error);
  }
};

const sendOtp = async (req, res, next) => {
  try {
    const { mobile } = req.body;
    if (!mobile) {
      return res.status(422).json({ success: false, message: 'Mobile number is required.' });
    }

    let user = await User.findOne({ mobile });
    if (!user) {
      user = await User.create({
        fullName: 'New User',
        email: `${mobile}@otp.local`,
        mobile,
        username: `user_${Date.now()}`,
        password: crypto.randomBytes(12).toString('hex'),
        role: 'Customer',
      });
    }

    const otpCode = generateRandomOtp();
    user.otpCode = otpCode;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await logAction(user._id, 'send_otp', req, { mobile });
    res.json({ success: true, message: 'OTP sent to your mobile number.', expiresIn: 600 });
  } catch (error) {
    next(error);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const { mobile, otp } = req.body;
    if (!mobile || !otp) {
      return res.status(422).json({ success: false, message: 'Mobile number and OTP are required.' });
    }

    const user = await User.findOne({ mobile }).select('+otpCode otpExpires refreshTokens');
    if (!user || !user.hasValidOtp(otp)) {
      return res.status(401).json({ success: false, message: 'Invalid or expired OTP.' });
    }

    user.otpCode = undefined;
    user.otpExpires = undefined;
    user.lastLoginAt = new Date();
    const accessToken = createAccessToken(user);
    const refreshTokenValue = createRefreshToken(user);
    await user.addRefreshToken(refreshTokenValue);
    await user.save();

    sendRefreshCookie(res, refreshTokenValue, true);
    await logAction(user._id, 'verify_otp', req);

    res.json({ success: true, user: normalizeUser(user), accessToken });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(422).json({ success: false, message: 'Email is required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.json({ success: true, message: 'If the email exists, reset instructions will be sent.' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    await logAction(user._id, 'forgot_password', req);
    res.json({ success: true, message: 'Password reset instructions sent to your email.', resetToken });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(422).json({ success: false, message: 'Reset token and new password are required.' });
    }

    const user = await User.findOne({ passwordResetToken: token, passwordResetExpires: { $gt: new Date() } }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid or expired reset token.' });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    await logAction(user._id, 'reset_password', req);
    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (error) {
    next(error);
  }
};

const verifyGoogleToken = async (token) => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  const ticket = await client.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID });
  return ticket.getPayload();
};

const googleAuth = async (req, res, next) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(422).json({ success: false, message: 'Google credential is required.' });
    }

    const payload = await verifyGoogleToken(credential);
    if (!payload || !payload.email) {
      return res.status(401).json({ success: false, message: 'Google authentication failed.' });
    }

    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = await User.create({
        fullName: payload.name || payload.email,
        email: payload.email,
        username: payload.email.split('@')[0],
        mobile: payload.phoneNumber || `${Date.now()}`,
        password: crypto.randomBytes(20).toString('hex'),
        role: 'Customer',
        googleId: payload.sub,
        avatar: payload.picture || '',
        isEmailVerified: true,
      });
    }

    if (!user.googleId) {
      user.googleId = payload.sub;
      await user.save();
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    await user.addRefreshToken(refreshToken);

    sendRefreshCookie(res, refreshToken, true);
    await logAction(user._id, 'google_login', req);

    res.json({ success: true, user: normalizeUser(user), accessToken });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
