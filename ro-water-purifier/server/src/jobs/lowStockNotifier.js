const prisma = require('../config/prisma');

async function findLowStockProducts() {
  return prisma.inventory.findMany({
    where: { stockStatus: { in: ['LOW_STOCK', 'OUT_OF_STOCK'] } },
    include: { product: { select: { id: true, name: true, sku: true } } },
  });
}

module.exports = { findLowStockProducts };
