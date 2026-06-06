const prisma = require('../config/prisma');
const slugify = require('../utils/slugify');

function parseJson(value) {
  if (!value || typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function normalizeProductPayload(body, files = []) {
  const mrp = body.mrp ?? body.price;
  const salePrice = body.salePrice ?? body.price ?? body.mrp;
  const data = {
    productType: body.productType || 'RO_PURIFIER',
    name: body.name,
    brandId: body.brandId || undefined,
    categoryId: body.categoryId,
    modelNumber: body.modelNumber || undefined,
    sku: body.sku,
    slug: body.slug || slugify(body.name),
    mrp: mrp !== undefined ? Number(mrp) : undefined,
    salePrice: salePrice !== undefined ? Number(salePrice) : undefined,
    costPrice: body.costPrice ? Number(body.costPrice) : null,
    stockQuantity: body.stockQuantity !== undefined ? Number(body.stockQuantity) : undefined,
    warrantyMonths: body.warrantyMonths ? Number(body.warrantyMonths) : null,
    description: body.description,
    features: parseJson(body.features),
    specifications: parseJson(body.specifications),
    status: body.status || 'ACTIVE',
    metaTitle: body.metaTitle,
    metaDescription: body.metaDescription,
  };

  const images = files.map((file, index) => ({
    imageUrl: `/uploads/products/${file.filename}`,
    altText: body.name,
    sortOrder: index,
    isPrimary: index === 0,
  }));

  return {
    data: Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined && value !== '')),
    images,
  };
}

async function createProduct(body, files) {
  const { data, images } = normalizeProductPayload(body, files);
  return prisma.product.create({
    data: {
      ...data,
      images: images.length ? { create: images } : undefined,
      inventory: {
        create: {
          stockQuantity: data.stockQuantity || 0,
          lowStockThreshold: Number(body.lowStockThreshold || 5),
          stockStatus: data.stockQuantity > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK',
        },
      },
    },
    include: {
      category: true,
      brand: true,
      images: true,
      inventory: true,
    },
  });
}

async function updateProduct(id, body, files) {
  const { data, images } = normalizeProductPayload(body, files);
  return prisma.product.update({
    where: { id },
    data: {
      ...data,
      images: images.length ? { create: images } : undefined,
      inventory:
        data.stockQuantity !== undefined
          ? {
              upsert: {
                update: {
                  stockQuantity: data.stockQuantity,
                  stockStatus: data.stockQuantity > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK',
                },
                create: {
                  stockQuantity: data.stockQuantity,
                  stockStatus: data.stockQuantity > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK',
                },
              },
            }
          : undefined,
    },
    include: {
      category: true,
      brand: true,
      images: true,
      inventory: true,
    },
  });
}

async function softDeleteProduct(id) {
  return prisma.product.update({
    where: { id },
    data: { deletedAt: new Date(), status: 'ARCHIVED' },
  });
}

async function restoreProduct(id) {
  return prisma.product.update({
    where: { id },
    data: { deletedAt: null, status: 'ACTIVE' },
  });
}

module.exports = {
  createProduct,
  updateProduct,
  softDeleteProduct,
  restoreProduct,
};
