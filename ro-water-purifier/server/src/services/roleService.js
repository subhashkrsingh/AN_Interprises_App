const prisma = require('../config/prisma');
const slugify = require('../utils/slugify');

const includePermissions = {
  permissions: {
    include: { permission: true },
  },
};

function normalizeRole(role) {
  return {
    ...role,
    permissionIds: role.permissions?.map(({ permissionId }) => permissionId) || [],
    permissionSlugs: role.permissions?.map(({ permission }) => permission.slug) || [],
  };
}

async function listRoles(query = {}) {
  const page = Math.max(Number(query.page || 1), 1);
  const limit = Math.min(Math.max(Number(query.limit || 10), 1), 100);
  const where = {};

  if (query.search) {
    where.OR = ['name', 'slug'].map((field) => ({
      [field]: { contains: query.search, mode: 'insensitive' },
    }));
  }

  const [items, total] = await Promise.all([
    prisma.role.findMany({
      where,
      include: includePermissions,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.role.count({ where }),
  ]);

  return {
    items: items.map(normalizeRole),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  };
}

async function getRole(id) {
  const role = await prisma.role.findUnique({ where: { id }, include: includePermissions });
  if (!role) {
    const error = new Error('Role not found.');
    error.statusCode = 404;
    throw error;
  }
  return normalizeRole(role);
}

async function createRole(data) {
  const { permissionIds = [], ...roleData } = data;
  const role = await prisma.role.create({
    data: {
      ...roleData,
      slug: roleData.slug || slugify(roleData.name),
      permissions: permissionIds.length
        ? {
            create: permissionIds.map((permissionId) => ({ permissionId })),
          }
        : undefined,
    },
    include: includePermissions,
  });

  return normalizeRole(role);
}

async function updateRole(id, data) {
  const { permissionIds, ...roleData } = data;
  const role = await prisma.$transaction(async (tx) => {
    if (Array.isArray(permissionIds)) {
      await tx.rolePermission.deleteMany({ where: { roleId: id } });
      if (permissionIds.length) {
        await tx.rolePermission.createMany({
          data: permissionIds.map((permissionId) => ({ roleId: id, permissionId })),
          skipDuplicates: true,
        });
      }
    }

    return tx.role.update({
      where: { id },
      data: {
        ...roleData,
        ...(roleData.name && !roleData.slug ? { slug: slugify(roleData.name) } : {}),
      },
      include: includePermissions,
    });
  });

  return normalizeRole(role);
}

async function removeRole(id) {
  const role = await prisma.role.findUnique({ where: { id } });
  if (role?.isSystem) {
    const error = new Error('System roles cannot be deleted.');
    error.statusCode = 422;
    throw error;
  }

  return prisma.role.delete({ where: { id } });
}

module.exports = { listRoles, getRole, createRole, updateRole, removeRole };
