const prisma = require('../config/prisma');

function parseStatus(value) {
  if (value === undefined || value === null || value === '') return undefined;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
}

class BaseRepository {
  constructor(modelName, options = {}) {
    this.modelName = modelName;
    this.model = prisma[modelName];
    this.searchFields = options.searchFields || [];
    this.include = options.include;
    this.defaultOrderBy = options.defaultOrderBy || { createdAt: 'desc' };
    this.softDelete = options.softDelete || false;
  }

  buildWhere(query = {}) {
    const where = {};
    const status = parseStatus(query.status);

    if (query.search && this.searchFields.length > 0) {
      where.OR = this.searchFields.map((field) => ({
        [field]: { contains: query.search, mode: 'insensitive' },
      }));
    }

    if (status !== undefined) where.status = status;
    if (this.softDelete && query.includeDeleted !== 'true') where.deletedAt = null;

    return where;
  }

  async list(query = {}) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 10), 1), 100);
    const skip = (page - 1) * limit;
    const where = this.buildWhere(query);

    const [items, total] = await Promise.all([
      this.model.findMany({
        where,
        skip,
        take: limit,
        orderBy: this.defaultOrderBy,
        ...(this.include ? { include: this.include } : {}),
      }),
      this.model.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  findById(id) {
    return this.model.findUnique({
      where: { id },
      ...(this.include ? { include: this.include } : {}),
    });
  }

  create(data) {
    return this.model.create({
      data,
      ...(this.include ? { include: this.include } : {}),
    });
  }

  update(id, data) {
    return this.model.update({
      where: { id },
      data,
      ...(this.include ? { include: this.include } : {}),
    });
  }

  delete(id) {
    if (this.softDelete) {
      return this.model.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    }

    return this.model.delete({ where: { id } });
  }

  restore(id) {
    return this.model.update({
      where: { id },
      data: { deletedAt: null },
      ...(this.include ? { include: this.include } : {}),
    });
  }
}

module.exports = BaseRepository;
