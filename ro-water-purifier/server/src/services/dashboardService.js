const prisma = require('../config/prisma');
const cache = require('../config/cache');

const currencySum = (aggregate) => Number(aggregate?._sum?.amount || aggregate?._sum?.grandTotal || 0);

async function getDashboardStats() {
  const cached = await cache.get('dashboard:overview');
  if (cached) return cached;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const renewalWindow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const [
    revenue,
    todayRevenue,
    monthlyRevenue,
    totalCustomers,
    totalProducts,
    totalServiceRequests,
    totalAmcCustomers,
    pendingServices,
    completedServices,
    activeEngineers,
    todaysLeads,
    totalOrders,
    latestOrders,
    latestLeads,
    latestServiceRequests,
    upcomingAmcRenewals,
    inventoryAlerts,
    notifications,
  ] = await Promise.all([
    prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'PAID' } }),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { createdAt: { gte: startOfToday }, status: 'PAID' } }),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { createdAt: { gte: startOfMonth }, status: 'PAID' } }),
    prisma.customer.count({ where: { deletedAt: null } }),
    prisma.product.count({ where: { deletedAt: null } }),
    prisma.serviceTicket.count({ where: { deletedAt: null } }),
    prisma.customerAmc.count({ where: { status: { in: ['ACTIVE', 'RENEWAL_DUE'] } } }),
    prisma.serviceTicket.count({ where: { status: { in: ['OPEN', 'ASSIGNED', 'IN_PROGRESS'] }, deletedAt: null } }),
    prisma.serviceTicket.count({ where: { status: 'COMPLETED', deletedAt: null } }),
    prisma.engineer.count({ where: { active: true } }),
    prisma.lead.count({ where: { createdAt: { gte: startOfToday }, deletedAt: null } }),
    prisma.order.count({ where: { deletedAt: null } }),
    prisma.order.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: { customer: { select: { customerName: true, mobileNumber: true } } },
    }),
    prisma.lead.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: {
        assignedTo: { select: { name: true } },
        interestProduct: { select: { name: true } },
      },
    }),
    prisma.serviceTicket.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { customerName: true, mobileNumber: true } },
        product: { select: { name: true, sku: true } },
        engineer: { select: { name: true } },
      },
    }),
    prisma.customerAmc.findMany({
      where: { status: { in: ['ACTIVE', 'RENEWAL_DUE'] }, endDate: { gte: now, lte: renewalWindow } },
      take: 8,
      orderBy: { endDate: 'asc' },
      include: {
        customer: { select: { customerName: true, mobileNumber: true } },
        plan: { select: { name: true, tier: true } },
      },
    }),
    prisma.inventory.findMany({
      where: { stockStatus: { in: ['LOW_STOCK', 'OUT_OF_STOCK'] } },
      take: 8,
      include: { product: { select: { id: true, name: true, sku: true } } },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.notification.findMany({
      take: 8,
      where: { isRead: false },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const revenueAnalytics = await prisma.$queryRaw`
    SELECT TO_CHAR(COALESCE("paidAt", "createdAt"), 'YYYY-MM') AS label,
           COALESCE(SUM("amount"), 0)::float AS revenue
    FROM payments
    WHERE "status" = 'PAID'
      AND COALESCE("paidAt", "createdAt") >= NOW() - INTERVAL '12 months'
    GROUP BY TO_CHAR(COALESCE("paidAt", "createdAt"), 'YYYY-MM')
    ORDER BY label ASC
  `;

  const serviceRequestTrends = await prisma.$queryRaw`
    SELECT TO_CHAR("createdAt", 'YYYY-MM') AS label,
           COUNT(*)::int AS tickets
    FROM service_tickets
    WHERE "createdAt" >= NOW() - INTERVAL '12 months'
    GROUP BY TO_CHAR("createdAt", 'YYYY-MM')
    ORDER BY label ASC
  `;

  const productSalesTrends = await prisma.$queryRaw`
    SELECT "itemName" AS label,
           COALESCE(SUM("quantity"), 0)::int AS units,
           COALESCE(SUM("total"), 0)::float AS revenue
    FROM order_items
    GROUP BY "itemName"
    ORDER BY revenue DESC
    LIMIT 8
  `;

  const leadConversion = await prisma.$queryRaw`
    SELECT "status" AS label,
           COUNT(*)::int AS leads
    FROM leads
    GROUP BY "status"
    ORDER BY leads DESC
  `;

  const engineerPerformance = await prisma.$queryRaw`
    SELECT e."name" AS label,
           COUNT(v."id")::int AS completed,
           COALESCE(AVG(v."customerRating"), 0)::float AS rating,
           COALESCE(SUM(v."serviceCharges"), 0)::float AS revenue
    FROM engineers e
    LEFT JOIN service_visits v ON v."engineerId" = e."id"
    GROUP BY e."name"
    ORDER BY completed DESC
    LIMIT 8
  `;

  const payload = {
    stats: {
      totalRevenue: currencySum(revenue),
      todaySales: currencySum(todayRevenue),
      monthlySales: currencySum(monthlyRevenue),
      totalOrders,
      totalCustomers,
      totalProducts,
      totalServiceRequests,
      totalAmcCustomers,
      pendingServices,
      completedServices,
      activeEngineers,
      todaysLeads,
    },
    charts: {
      revenueAnalytics,
      leadConversion,
      serviceRequestTrends,
      productSalesTrends,
      engineerPerformance,
    },
    latestOrders,
    latestLeads,
    latestServiceRequests,
    upcomingAmcRenewals,
    inventoryAlerts,
    notifications,
  };

  await cache.set('dashboard:overview', payload, 60);
  return payload;
}

module.exports = { getDashboardStats };
