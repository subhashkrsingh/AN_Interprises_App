const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const modules = [
  'dashboard',
  'products',
  'categories',
  'brands',
  'orders',
  'customers',
  'inventory',
  'coupons',
  'banners',
  'cms',
  'reviews',
  'reports',
  'settings',
  'users',
  'roles',
  'notifications',
  'activity_logs',
];

const actions = ['view', 'create', 'edit', 'delete'];

async function upsertPermissions() {
  const permissions = [];
  for (const module of modules) {
    for (const action of actions) {
      permissions.push({
        slug: `${module}.${action}`,
        name: `${action} ${module}`.replace(/_/g, ' '),
        module,
      });
    }
  }

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { slug: permission.slug },
      update: permission,
      create: permission,
    });
  }
}

async function upsertRoles() {
  const roleData = [
    { name: 'Super Admin', slug: 'super-admin', modules },
    { name: 'Admin', slug: 'admin', modules: modules.filter((module) => !['settings'].includes(module)) },
    { name: 'Manager', slug: 'manager', modules: ['dashboard', 'products', 'orders', 'customers', 'reports'] },
    { name: 'Inventory Staff', slug: 'inventory-staff', modules: ['dashboard', 'products', 'inventory', 'orders'] },
    { name: 'Customer Support', slug: 'customer-support', modules: ['dashboard', 'orders', 'customers', 'reviews'] },
  ];

  for (const role of roleData) {
    const createdRole = await prisma.role.upsert({
      where: { slug: role.slug },
      update: { name: role.name, isSystem: true },
      create: { name: role.name, slug: role.slug, isSystem: true },
    });

    const permissions = await prisma.permission.findMany({
      where: { module: { in: role.modules } },
    });

    for (const permission of permissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: createdRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: createdRole.id,
          permissionId: permission.id,
        },
      });
    }
  }
}

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL || 'superadmin@example.com';
  const password = process.env.SEED_ADMIN_PASSWORD || 'Admin@12345';
  const passwordHash = await bcrypt.hash(password, 12);
  const superRole = await prisma.role.findUnique({ where: { slug: 'super-admin' } });

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name: process.env.SEED_ADMIN_NAME || 'Super Admin',
      passwordHash,
      status: 'ACTIVE',
    },
    create: {
      name: process.env.SEED_ADMIN_NAME || 'Super Admin',
      email,
      passwordHash,
      status: 'ACTIVE',
    },
  });

  if (superRole) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: user.id, roleId: superRole.id } },
      update: {},
      create: { userId: user.id, roleId: superRole.id },
    });
  }
}

async function seedCatalog() {
  const category = await prisma.category.upsert({
    where: { slug: 'water-purifiers' },
    update: {},
    create: {
      name: 'Water Purifiers',
      slug: 'water-purifiers',
      description: 'RO, UV and smart purification systems.',
      status: true,
    },
  });

  const brand = await prisma.brand.upsert({
    where: { slug: 'aqua-prime' },
    update: {},
    create: {
      name: 'Aqua Prime',
      slug: 'aqua-prime',
      description: 'Premium water purification appliances.',
      status: true,
    },
  });

  const vendor = await prisma.vendor.upsert({
    where: { id: 'seed-vendor-aqua-prime' },
    update: {},
    create: {
      id: 'seed-vendor-aqua-prime',
      name: 'Aqua Prime Distribution',
      email: 'vendor@example.com',
      phone: '+91 90000 00000',
      status: true,
    },
  });

  const product = await prisma.product.upsert({
    where: { sku: 'RO-SMART-001' },
    update: {},
    create: {
      name: 'Smart RO Purifier',
      sku: 'RO-SMART-001',
      barcode: '890000000001',
      slug: 'smart-ro-purifier',
      description: 'Seven-stage smart RO purifier with service alerts.',
      shortDescription: 'Smart RO purifier for modern homes.',
      price: 24999,
      salePrice: 21999,
      costPrice: 15000,
      stockQuantity: 24,
      taxPercentage: 18,
      status: 'ACTIVE',
      categoryId: category.id,
      brandId: brand.id,
      vendorId: vendor.id,
      metaTitle: 'Smart RO Purifier',
      metaDescription: 'Buy premium smart RO water purifier online.',
      metaKeywords: 'ro purifier, smart ro, water purifier',
      inventory: {
        create: {
          stockQuantity: 24,
          lowStockThreshold: 5,
          stockStatus: 'IN_STOCK',
        },
      },
      images: {
        create: [
          {
            imageUrl: '/uploads/products/smart-ro-purifier.jpg',
            altText: 'Smart RO Purifier',
            isPrimary: true,
          },
        ],
      },
    },
  });

  const customer = await prisma.customer.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      firstName: 'Aarav',
      lastName: 'Sharma',
      email: 'customer@example.com',
      phone: '+91 91111 11111',
      status: 'ACTIVE',
      addresses: {
        create: {
          label: 'Home',
          line1: '12 Lake View Road',
          city: 'Ahmedabad',
          state: 'Gujarat',
          postalCode: '380001',
          isDefault: true,
        },
      },
    },
    include: { addresses: true },
  });

  const existingOrder = await prisma.order.findUnique({ where: { orderNumber: 'ORD-10001' } });
  if (!existingOrder) {
    await prisma.order.create({
      data: {
        orderNumber: 'ORD-10001',
        customerId: customer.id,
        shippingAddressId: customer.addresses[0]?.id,
        status: 'DELIVERED',
        subtotal: 21999,
        discountTotal: 0,
        taxTotal: 3959.82,
        shippingTotal: 0,
        grandTotal: 25958.82,
        paymentStatus: 'PAID',
        paymentMethod: 'Razorpay',
        items: {
          create: [
            {
              productId: product.id,
              productName: product.name,
              sku: product.sku,
              quantity: 1,
              unitPrice: 21999,
              total: 21999,
            },
          ],
        },
      },
    });
  }
}

async function seedSettings() {
  const settings = [
    { group: 'general', key: 'site_name', value: 'Enterprise Commerce' },
    { group: 'general', key: 'site_logo', value: '/logo.svg' },
    { group: 'email', key: 'smtp_host', value: 'smtp.example.com' },
    { group: 'payment', key: 'razorpay_enabled', value: true },
    { group: 'payment', key: 'stripe_enabled', value: false },
    { group: 'shipping', key: 'free_shipping_minimum', value: 5000 },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: setting,
      create: setting,
    });
  }
}

async function main() {
  await upsertPermissions();
  await upsertRoles();
  await seedAdmin();
  await seedCatalog();
  await seedSettings();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
