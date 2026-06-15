const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const modules = [
  'dashboard',
  'products',
  'categories',
  'brands',
  'customers',
  'customer-notes',
  'leads',
  'lead-followups',
  'suppliers',
  'inventory',
  'engineers',
  'engineer-attendance',
  'service-tickets',
  'service-visits',
  'amc-plans',
  'customer-amc',
  'orders',
  'order-items',
  'payments',
  'banners',
  'testimonials',
  'faqs',
  'blogs',
  'website-settings',
  'settings',
  'invoices',
  'quotations',
  'notifications',
  'permissions',
  'user-sessions',
  'login-history',
  'activity-logs',
  'users',
  'roles',
  'reports',
];

const actions = ['view', 'create', 'edit', 'delete'];

async function upsertPermissions() {
  const permissions = [];

  for (const moduleName of modules) {
    for (const action of actions) {
      permissions.push({
        slug: `${moduleName}.${action}`,
        name: `${action} ${moduleName}`.replace(/-/g, ' '),
        module: moduleName,
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
    {
      name: 'Admin',
      slug: 'admin',
      modules: modules.filter((module) => !['settings', 'website-settings'].includes(module)),
    },
    {
      name: 'Manager',
      slug: 'manager',
      modules: [
        'dashboard',
        'products',
        'categories',
        'brands',
        'customers',
        'leads',
        'orders',
        'payments',
        'reports',
        'service-tickets',
        'customer-amc',
      ],
    },
    {
      name: 'Inventory Staff',
      slug: 'inventory-staff',
      modules: ['dashboard', 'products', 'inventory', 'suppliers', 'orders'],
    },
    {
      name: 'Customer Support',
      slug: 'customer-support',
      modules: ['dashboard', 'customers', 'leads', 'service-tickets', 'service-visits', 'notifications'],
    },
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

async function seedSuperAdmin() {
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
      updatedAt: new Date(),
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

  return user;
}

async function seedWebsiteSettings() {
  const settings = [
    { group: 'general', key: 'site_name', value: 'Aqua Prime RO Systems', isPublic: true },
    { group: 'general', key: 'support_email', value: 'support@aquaprime.example', isPublic: false },
    { group: 'general', key: 'support_phone', value: '+919000000001', isPublic: false },
  ];

  for (const setting of settings) {
    await prisma.websiteSetting.upsert({
      where: { key: setting.key },
      update: setting,
      create: setting,
    });
  }
}

async function seedCatalog() {
  const category = await prisma.category.upsert({
    where: { slug: 'water-purifiers' },
    update: {
      name: 'Water Purifiers',
      description: 'RO and water purification systems for homes and offices.',
      status: true,
      updatedAt: new Date(),
    },
    create: {
      name: 'Water Purifiers',
      slug: 'water-purifiers',
      description: 'RO and water purification systems for homes and offices.',
      status: true,
    },
  });

  const brand = await prisma.brand.upsert({
    where: { slug: 'aqua-prime' },
    update: {
      name: 'Aqua Prime',
      description: 'Premium water purification appliances.',
      status: true,
      updatedAt: new Date(),
    },
    create: {
      name: 'Aqua Prime',
      slug: 'aqua-prime',
      description: 'Premium water purification appliances.',
      status: true,
    },
  });

  const product = await prisma.product.upsert({
    where: { sku: 'RO-SMART-001' },
    update: {
      productType: 'RO_PURIFIER',
      name: 'Smart RO Purifier',
      slug: 'smart-ro-purifier',
      modelNumber: 'AP-RO-1001',
      mrp: '24999.00',
      salePrice: '21999.00',
      costPrice: '15000.00',
      stockQuantity: 24,
      warrantyMonths: 24,
      description: 'Seven-stage smart RO purifier with service alerts.',
      status: 'ACTIVE',
      brandId: brand.id,
      categoryId: category.id,
      metaTitle: 'Smart RO Purifier',
      metaDescription: 'Premium RO purifier for modern homes.',
      updatedAt: new Date(),
    },
    create: {
      productType: 'RO_PURIFIER',
      name: 'Smart RO Purifier',
      slug: 'smart-ro-purifier',
      modelNumber: 'AP-RO-1001',
      sku: 'RO-SMART-001',
      brandId: brand.id,
      categoryId: category.id,
      mrp: '24999.00',
      salePrice: '21999.00',
      costPrice: '15000.00',
      stockQuantity: 24,
      warrantyMonths: 24,
      description: 'Seven-stage smart RO purifier with service alerts.',
      status: 'ACTIVE',
      metaTitle: 'Smart RO Purifier',
      metaDescription: 'Premium RO purifier for modern homes.',
    },
  });

  await prisma.inventory.upsert({
    where: { productId: product.id },
    update: {
      stockQuantity: 24,
      lowStockThreshold: 5,
      stockStatus: 'IN_STOCK',
      updatedAt: new Date(),
    },
    create: {
      productId: product.id,
      stockQuantity: 24,
      lowStockThreshold: 5,
      stockStatus: 'IN_STOCK',
    },
  });

  await prisma.productImage.upsert({
    where: { id: 'seed-product-image-ro-smart-001' },
    update: {
      product: {
        connect: { id: product.id },
      },
      imageUrl: '/uploads/products/smart-ro-purifier.jpg',
      altText: 'Smart RO Purifier',
      isPrimary: true,
      sortOrder: 0,
    },
    create: {
      id: 'seed-product-image-ro-smart-001',
      productId: product.id,
      imageUrl: '/uploads/products/smart-ro-purifier.jpg',
      altText: 'Smart RO Purifier',
      isPrimary: true,
      sortOrder: 0,
    },
  });

  return product;
}

async function seedCustomer() {
  return prisma.customer.upsert({
    where: { mobileNumber: '+919111111111' },
    update: {
      customerName: 'Aarav Sharma',
      whatsappNumber: '+919111111111',
      email: 'aarav.sharma@example.com',
      address: '12 Lake View Road',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380001',
      waterTdsLevel: 250,
      installationDate: new Date('2025-12-15T00:00:00Z'),
      customerNotes: 'Initial RO installation with smart maintenance support.',
      status: 'ACTIVE',
      updatedAt: new Date(),
    },
    create: {
      customerName: 'Aarav Sharma',
      mobileNumber: '+919111111111',
      whatsappNumber: '+919111111111',
      email: 'aarav.sharma@example.com',
      address: '12 Lake View Road',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380001',
      waterTdsLevel: 250,
      installationDate: new Date('2025-12-15T00:00:00Z'),
      customerNotes: 'Initial RO installation with smart maintenance support.',
      status: 'ACTIVE',
    },
  });
}

async function seedEngineer() {
  return prisma.engineer.upsert({
    where: { mobile: '+919222222222' },
    update: {
      name: 'Rohit Patel',
      email: 'rohit.patel@aquaprime.example',
      skills: { certifications: ['RO Installation', 'AMC Service'], specialties: ['RO Purifiers', 'Water Quality'] },
      active: true,
      rating: '4.80',
      currentLocation: { latitude: 23.0225, longitude: 72.5714 },
      updatedAt: new Date(),
    },
    create: {
      name: 'Rohit Patel',
      mobile: '+919222222222',
      email: 'rohit.patel@aquaprime.example',
      skills: { certifications: ['RO Installation', 'AMC Service'], specialties: ['RO Purifiers', 'Water Quality'] },
      active: true,
      rating: '4.80',
      currentLocation: { latitude: 23.0225, longitude: 72.5714 },
    },
  });
}

async function seedAmcPlan() {
  return prisma.amcPlan.upsert({
    where: { id: 'seed-amc-plan-silver' },
    update: {
      name: 'Silver AMC Plan',
      tier: 'SILVER',
      durationMonths: 12,
      includedVisits: 4,
      includedParts: { filters: 'included', membrane: 'one replacement' },
      price: '4999.00',
      description: 'Annual AMC with four preventive visits and filter checks.',
      active: true,
      updatedAt: new Date(),
    },
    create: {
      id: 'seed-amc-plan-silver',
      name: 'Silver AMC Plan',
      tier: 'SILVER',
      durationMonths: 12,
      includedVisits: 4,
      includedParts: { filters: 'included', membrane: 'one replacement' },
      price: '4999.00',
      description: 'Annual AMC with four preventive visits and filter checks.',
      active: true,
    },
  });
}

async function seedCustomerAmc(customer, product, engineer, plan) {
  return prisma.customerAmc.upsert({
    where: { id: 'seed-customer-amc-aarav' },
    update: {
      customerId: customer.id,
      productId: product.id,
      planId: plan.id,
      engineerId: engineer.id,
      startDate: new Date('2025-12-20T00:00:00Z'),
      endDate: new Date('2026-12-19T00:00:00Z'),
      includedVisits: 4,
      usedVisits: 0,
      includedParts: { filterReplacement: true, membraneCheck: true },
      price: '4999.00',
      status: 'ACTIVE',
      nextServiceDate: new Date('2026-03-20T00:00:00Z'),
      updatedAt: new Date(),
    },
    create: {
      id: 'seed-customer-amc-aarav',
      customerId: customer.id,
      productId: product.id,
      planId: plan.id,
      engineerId: engineer.id,
      startDate: new Date('2025-12-20T00:00:00Z'),
      endDate: new Date('2026-12-19T00:00:00Z'),
      includedVisits: 4,
      usedVisits: 0,
      includedParts: { filterReplacement: true, membraneCheck: true },
      price: '4999.00',
      status: 'ACTIVE',
      nextServiceDate: new Date('2026-03-20T00:00:00Z'),
    },
  });
}

async function seedLead(customer, product, assignedTo) {
  return prisma.lead.upsert({
    where: { leadNumber: 'LEAD-0001' },
    update: {
      customerId: customer.id,
      assignedToId: assignedTo.id,
      interestProductId: product.id,
      source: 'WEBSITE',
      status: 'CONTACTED',
      name: 'Aarav Sharma',
      mobile: '+919111111111',
      whatsappNumber: '+919111111111',
      email: 'aarav.sharma@example.com',
      city: 'Ahmedabad',
      budget: '25000.00',
      notes: 'Interested in a smart RO purifier with annual AMC package.',
      nextFollowUpAt: new Date('2025-12-10T10:00:00Z'),
      updatedAt: new Date(),
    },
    create: {
      leadNumber: 'LEAD-0001',
      customerId: customer.id,
      assignedToId: assignedTo.id,
      interestProductId: product.id,
      source: 'WEBSITE',
      status: 'CONTACTED',
      name: 'Aarav Sharma',
      mobile: '+919111111111',
      whatsappNumber: '+919111111111',
      email: 'aarav.sharma@example.com',
      city: 'Ahmedabad',
      budget: '25000.00',
      notes: 'Interested in a smart RO purifier with annual AMC package.',
      nextFollowUpAt: new Date('2025-12-10T10:00:00Z'),
    },
  });
}

async function seedServiceTicket(customer, product, engineer) {
  return prisma.serviceTicket.upsert({
    where: { ticketNumber: 'SRV-0001' },
    update: {
      customerId: customer.id,
      productId: product.id,
      engineerId: engineer.id,
      type: 'INSTALLATION',
      status: 'ASSIGNED',
      visitDate: new Date('2025-12-22T09:00:00Z'),
      issue: 'New RO purifier installation and site readiness check.',
      resolution: 'Installation scheduled; engineer dispatched with equipment.',
      partsUsed: { filters: ['pre-filter', 'RO membrane'], tools: ['wrench', 'pressure gauge'] },
      serviceCharges: '1499.00',
      priority: 'High',
      updatedAt: new Date(),
    },
    create: {
      ticketNumber: 'SRV-0001',
      customerId: customer.id,
      productId: product.id,
      engineerId: engineer.id,
      type: 'INSTALLATION',
      status: 'ASSIGNED',
      visitDate: new Date('2025-12-22T09:00:00Z'),
      issue: 'New RO purifier installation and site readiness check.',
      resolution: 'Installation scheduled; engineer dispatched with equipment.',
      partsUsed: { filters: ['pre-filter', 'RO membrane'], tools: ['wrench', 'pressure gauge'] },
      serviceCharges: '1499.00',
      priority: 'High',
    },
  });
}

async function main() {
  await upsertPermissions();
  await upsertRoles();
  await seedSuperAdmin();
  await seedWebsiteSettings();

  const product = await seedCatalog();
  const customer = await seedCustomer();
  const engineer = await seedEngineer();
  const plan = await seedAmcPlan();
  const superAdmin = await prisma.user.findUnique({ where: { email: 'superadmin@example.com' } });

  await seedCustomerAmc(customer, product, engineer, plan);
  await seedLead(customer, product, superAdmin);
  await seedServiceTicket(customer, product, engineer);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('✅ Seed complete');
  })
  .catch(async (error) => {
    console.error('❌ Seed failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
