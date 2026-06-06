const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const prisma = require('../config/prisma');
const env = require('../config/env');
const { comparePassword, hashPassword } = require('../utils/password');
const { flattenAccess, hashToken, randomToken, signAccessToken, signRefreshToken } = require('../utils/tokens');
const { sendMail } = require('../utils/mailer');

const REFRESH_COOKIE = 'admin_refresh_token';

function normalizeUser(user) {
  if (!user) return null;
  const { roles, permissions } = flattenAccess(user);
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    status: user.status,
    avatarUrl: user.avatarUrl,
    lastLoginAt: user.lastLoginAt,
    roles,
    permissions,
  };
}

function refreshCookieOptions() {
  return {
    httpOnly: true,
    secure: env.cookieSecure || env.nodeEnv === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

async function persistRefreshToken(user, refreshToken) {
  return userRepository.update(user.id, {
    refreshTokenHash: hashToken(refreshToken),
    refreshTokenExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
}

function getDeviceName(context = {}) {
  const userAgent = context.userAgent || '';
  if (/mobile/i.test(userAgent)) return 'Mobile Browser';
  if (/windows/i.test(userAgent)) return 'Windows Workstation';
  if (/mac/i.test(userAgent)) return 'Mac Workstation';
  return 'Browser Session';
}

function getClientContext(context = {}) {
  return {
    ipAddress: context.ipAddress,
    userAgent: context.userAgent,
    deviceName: context.deviceName || getDeviceName(context),
    deviceType: /mobile/i.test(context.userAgent || '') ? 'mobile' : 'desktop',
  };
}

async function writeLoginHistory({ userId, email, result, reason, context }) {
  const client = getClientContext(context);
  return prisma.loginHistory.create({
    data: {
      userId,
      email: String(email || '').toLowerCase(),
      result,
      reason,
      ipAddress: client.ipAddress,
      userAgent: client.userAgent,
      deviceName: client.deviceName,
    },
  });
}

async function createSession(user, refreshToken, context) {
  const client = getClientContext(context);
  return prisma.userSession.create({
    data: {
      userId: user.id,
      refreshTokenHash: hashToken(refreshToken),
      deviceName: client.deviceName,
      deviceType: client.deviceType,
      ipAddress: client.ipAddress,
      userAgent: client.userAgent,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });
}

async function completeLogin(user, context) {
  const updatedUser = await userRepository.update(user.id, { lastLoginAt: new Date() });
  const accessToken = signAccessToken(updatedUser);
  const refreshToken = signRefreshToken(updatedUser);
  await persistRefreshToken(updatedUser, refreshToken);
  await createSession(updatedUser, refreshToken, context);
  await writeLoginHistory({ userId: user.id, email: user.email, result: 'SUCCESS', context });

  return { user: normalizeUser(updatedUser), accessToken, refreshToken };
}

async function createTwoFactorChallenge(user, context) {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const challenge = await prisma.twoFactorChallenge.create({
    data: {
      userId: user.id,
      codeHash: hashToken(code),
      ipAddress: context?.ipAddress,
      userAgent: context?.userAgent,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  await sendMail({
    to: user.email,
    subject: 'Your admin verification code',
    text: `Your admin verification code is ${code}. It expires in 10 minutes.`,
    html: `<p>Your admin verification code is <strong>${code}</strong>.</p><p>It expires in 10 minutes.</p>`,
  });

  await writeLoginHistory({
    userId: user.id,
    email: user.email,
    result: 'TWO_FACTOR_REQUIRED',
    context,
  });

  return {
    requiresTwoFactor: true,
    challengeId: challenge.id,
    email: user.email,
    ...(env.nodeEnv !== 'production' ? { code } : {}),
  };
}

async function login({ email, password }, context = {}) {
  const user = await userRepository.findByEmail(String(email || '').toLowerCase());
  if (!user || user.status !== 'ACTIVE') {
    await writeLoginHistory({ email, result: 'FAILED', reason: 'Invalid email or inactive user', context });
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const matches = await comparePassword(password, user.passwordHash);
  if (!matches) {
    await writeLoginHistory({ userId: user.id, email, result: 'FAILED', reason: 'Invalid password', context });
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  if (user.twoFactorEnabled) {
    return createTwoFactorChallenge(user, context);
  }

  return completeLogin(user, context);
}

async function refresh(refreshToken) {
  if (!refreshToken) {
    const error = new Error('Refresh token is required.');
    error.statusCode = 401;
    throw error;
  }

  const decoded = jwt.verify(refreshToken, env.jwtRefreshSecret);
  if (decoded.type !== 'refresh') {
    const error = new Error('Invalid refresh token.');
    error.statusCode = 401;
    throw error;
  }

  const user = await userRepository.findById(decoded.sub);
  if (!user || user.refreshTokenHash !== hashToken(refreshToken)) {
    const error = new Error('Refresh token is invalid or expired.');
    error.statusCode = 401;
    throw error;
  }

  const accessToken = signAccessToken(user);
  const nextRefreshToken = signRefreshToken(user);
  await persistRefreshToken(user, nextRefreshToken);

  return { user: normalizeUser(user), accessToken, refreshToken: nextRefreshToken };
}

async function logout(userId, refreshToken) {
  if (!userId) return;
  const tokenHash = refreshToken ? hashToken(refreshToken) : undefined;
  if (tokenHash) {
    await prisma.userSession.updateMany({
      where: { userId, refreshTokenHash: tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      refreshTokenHash: null,
      refreshTokenExpires: null,
    },
  });
}

async function verifyTwoFactor(challengeId, code, context = {}) {
  const challenge = await prisma.twoFactorChallenge.findFirst({
    where: {
      id: challengeId,
      codeHash: hashToken(String(code || '')),
      consumedAt: null,
      expiresAt: { gt: new Date() },
    },
    include: {
      user: {
        include: {
          roles: {
            include: {
              role: {
                include: {
                  permissions: { include: { permission: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!challenge || challenge.user.status !== 'ACTIVE') {
    const error = new Error('Verification code is invalid or expired.');
    error.statusCode = 401;
    throw error;
  }

  await prisma.twoFactorChallenge.update({
    where: { id: challenge.id },
    data: { consumedAt: new Date() },
  });

  return completeLogin(challenge.user, context);
}

async function enableTwoFactor(userId) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      twoFactorEnabled: true,
      twoFactorSecret: randomToken(16),
    },
  });
}

async function disableTwoFactor(userId) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      twoFactorEnabled: false,
      twoFactorSecret: null,
      twoFactorBackupCodes: null,
    },
  });
}

async function changePassword(userId, currentPassword, nextPassword) {
  const user = await userRepository.findById(userId);
  const matches = await comparePassword(currentPassword, user.passwordHash);
  if (!matches) {
    const error = new Error('Current password is incorrect.');
    error.statusCode = 422;
    throw error;
  }

  await userRepository.update(userId, {
    passwordHash: await hashPassword(nextPassword),
    refreshTokenHash: null,
    refreshTokenExpires: null,
  });
}

async function forgotPassword(email) {
  const user = await userRepository.findByEmail(String(email || '').toLowerCase());
  if (!user) return { delivered: true };

  const resetToken = randomToken();
  await userRepository.update(user.id, {
    passwordResetTokenHash: hashToken(resetToken),
    passwordResetExpires: new Date(Date.now() + 60 * 60 * 1000),
  });

  await sendMail({
    to: user.email,
    subject: 'Reset your admin password',
    text: `Use this reset token: ${resetToken}`,
    html: `<p>Use this reset token:</p><p><strong>${resetToken}</strong></p>`,
  });

  return {
    delivered: true,
    ...(env.nodeEnv !== 'production' ? { resetToken } : {}),
  };
}

async function resetPassword(token, password) {
  const user = await prisma.user.findFirst({
    where: {
      passwordResetTokenHash: hashToken(token),
      passwordResetExpires: { gt: new Date() },
    },
  });

  if (!user) {
    const error = new Error('Reset token is invalid or expired.');
    error.statusCode = 401;
    throw error;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await hashPassword(password),
      passwordResetTokenHash: null,
      passwordResetExpires: null,
      refreshTokenHash: null,
      refreshTokenExpires: null,
    },
  });
}

module.exports = {
  REFRESH_COOKIE,
  normalizeUser,
  refreshCookieOptions,
  login,
  verifyTwoFactor,
  enableTwoFactor,
  disableTwoFactor,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
};
