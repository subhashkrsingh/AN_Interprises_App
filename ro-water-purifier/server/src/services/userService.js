const prisma = require('../config/prisma');
const { hashPassword } = require('../utils/password');
const { normalizeUser } = require('./authService');

const includeRoles = {
  roles: {
    include: {
      role: {
        include: {
          permissions: { include: { permission: true } },
        },
      },
    },
  },
};

function toSafeUser(user) {
  const normalized = normalizeUser(user);
  return {
    ...normalized,
    roleIds: user.roles?.map(({ roleId }) => roleId) || [],
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function listUsers(query = {}) {
  const page = Math.max(Number(query.page || 1), 1);
  const limit = Math.min(Math.max(Number(query.limit || 10), 1), 100);
  const where = {};

  if (query.search) {
    where.OR = ['name', 'email', 'phone'].map((field) => ({
      [field]: { contains: query.search, mode: 'insensitive' },
    }));
  }

  if (query.status) where.status = query.status;

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: includeRoles,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    items: items.map(toSafeUser),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  };
}

async function getUser(id) {
  const user = await prisma.user.findUnique({ where: { id }, include: includeRoles });
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }
  return toSafeUser(user);
}

async function createUser(data) {
  const { roleIds = [], password, ...userData } = data;
  const user = await prisma.user.create({
    data: {
      ...userData,
      email: String(userData.email).toLowerCase(),
      passwordHash: await hashPassword(password || 'Admin@12345'),
      roles: roleIds.length
        ? {
            create: roleIds.map((roleId) => ({ roleId })),
          }
        : undefined,
    },
    include: includeRoles,
  });

  return toSafeUser(user);
}

async function updateUser(id, data) {
  const { roleIds, password, ...userData } = data;
  const updateData = {
    ...userData,
    ...(userData.email ? { email: String(userData.email).toLowerCase() } : {}),
    ...(password ? { passwordHash: await hashPassword(password) } : {}),
  };

  const user = await prisma.$transaction(async (tx) => {
    if (Array.isArray(roleIds)) {
      await tx.userRole.deleteMany({ where: { userId: id } });
      if (roleIds.length) {
        await tx.userRole.createMany({
          data: roleIds.map((roleId) => ({ userId: id, roleId })),
          skipDuplicates: true,
        });
      }
    }

    return tx.user.update({
      where: { id },
      data: updateData,
      include: includeRoles,
    });
  });

  return toSafeUser(user);
}

async function removeUser(id) {
  return prisma.user.update({
    where: { id },
    data: { status: 'INACTIVE', refreshTokenHash: null, refreshTokenExpires: null },
  });
}

module.exports = { listUsers, getUser, createUser, updateUser, removeUser };
