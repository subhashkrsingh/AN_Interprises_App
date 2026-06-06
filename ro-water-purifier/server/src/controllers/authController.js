const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
const authService = require('../services/authService');
const { logActivity } = require('../services/activityLogService');

const login = asyncHandler(async (req, res) => {
  const context = { ipAddress: req.ip, userAgent: req.get('user-agent') };
  const result = await authService.login(req.body, context);
  if (result.requiresTwoFactor) {
    return success(res, result, 'Two-factor verification required.');
  }

  res.cookie(authService.REFRESH_COOKIE, result.refreshToken, authService.refreshCookieOptions());
  await logActivity(req, { module: 'auth', action: 'login', entity: 'user', entityId: result.user.id });
  success(res, { user: result.user, accessToken: result.accessToken }, 'Login successful.');
});

const verifyTwoFactor = asyncHandler(async (req, res) => {
  const context = { ipAddress: req.ip, userAgent: req.get('user-agent') };
  const result = await authService.verifyTwoFactor(req.body.challengeId, req.body.code, context);
  res.cookie(authService.REFRESH_COOKIE, result.refreshToken, authService.refreshCookieOptions());
  await logActivity(req, { module: 'auth', action: 'two_factor_login', entity: 'user', entityId: result.user.id });
  success(res, { user: result.user, accessToken: result.accessToken }, 'Two-factor verification successful.');
});

const refresh = asyncHandler(async (req, res) => {
  const result = await authService.refresh(req.cookies?.[authService.REFRESH_COOKIE]);
  res.cookie(authService.REFRESH_COOKIE, result.refreshToken, authService.refreshCookieOptions());
  success(res, { user: result.user, accessToken: result.accessToken }, 'Token refreshed.');
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user?.id, req.cookies?.[authService.REFRESH_COOKIE]);
  res.clearCookie(authService.REFRESH_COOKIE);
  await logActivity(req, { module: 'auth', action: 'logout' });
  success(res, null, 'Logged out successfully.');
});

const me = asyncHandler(async (req, res) => {
  success(res, { user: req.user }, 'Current session.');
});

const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.body.email);
  success(res, result, 'If the email exists, password reset instructions were sent.');
});

const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body.token, req.body.password);
  success(res, null, 'Password reset successful.');
});

const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user.id, req.body.currentPassword, req.body.password);
  await logActivity(req, { module: 'auth', action: 'change_password' });
  success(res, null, 'Password changed successfully.');
});

const enableTwoFactor = asyncHandler(async (req, res) => {
  await authService.enableTwoFactor(req.user.id);
  await logActivity(req, { module: 'auth', action: 'enable_2fa' });
  success(res, null, 'Two-factor authentication enabled.');
});

const disableTwoFactor = asyncHandler(async (req, res) => {
  await authService.disableTwoFactor(req.user.id);
  await logActivity(req, { module: 'auth', action: 'disable_2fa' });
  success(res, null, 'Two-factor authentication disabled.');
});

module.exports = {
  login,
  verifyTwoFactor,
  refresh,
  logout,
  me,
  forgotPassword,
  resetPassword,
  changePassword,
  enableTwoFactor,
  disableTwoFactor,
};
