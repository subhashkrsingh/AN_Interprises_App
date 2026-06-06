const userSelect = { id: true, name: true, email: true };
const customerSelect = { id: true, customerName: true, mobileNumber: true, city: true };
const productSelect = { id: true, name: true, sku: true, modelNumber: true };
const engineerSelect = { id: true, name: true, mobile: true };

const resourceConfigs = {
  products: {
    modelName: 'product',
    searchFields: ['name', 'sku', 'modelNumber', 'slug'],
    softDelete: true,
    numberFields: ['mrp', 'salePrice', 'costPrice'],
    intFields: ['stockQuantity', 'warrantyMonths'],
    jsonFields: ['features', 'specifications'],
    include: {
      category: { select: { id: true, name: true } },
      brand: { select: { id: true, name: true } },
      inventory: true,
      images: true,
    },
  },
  categories: {
    modelName: 'category',
    searchFields: ['name', 'slug'],
    softDelete: true,
    intFields: ['sortOrder'],
    booleanFields: ['status'],
    include: { parent: { select: { id: true, name: true } } },
  },
  brands: {
    modelName: 'brand',
    searchFields: ['name', 'slug'],
    softDelete: true,
    booleanFields: ['status'],
  },
  customers: {
    modelName: 'customer',
    searchFields: ['customerName', 'mobileNumber', 'whatsappNumber', 'email', 'city', 'state'],
    softDelete: true,
    intFields: ['waterTdsLevel'],
    dateFields: ['installationDate'],
    include: { notes: true, amcContracts: true },
  },
  'customer-notes': {
    modelName: 'customerNote',
    searchFields: ['note'],
    include: {
      customer: { select: customerSelect },
      user: { select: userSelect },
    },
  },
  leads: {
    modelName: 'lead',
    searchFields: ['leadNumber', 'name', 'mobile', 'whatsappNumber', 'email', 'city'],
    softDelete: true,
    numberFields: ['budget'],
    dateFields: ['nextFollowUpAt'],
    sequence: { field: 'leadNumber', prefix: 'LEAD' },
    include: {
      customer: { select: customerSelect },
      assignedTo: { select: userSelect },
      interestProduct: { select: productSelect },
    },
  },
  'lead-followups': {
    modelName: 'leadFollowup',
    searchFields: ['channel', 'outcome', 'notes'],
    dateFields: ['scheduledAt', 'completedAt'],
    include: {
      lead: { select: { id: true, leadNumber: true, name: true } },
      user: { select: userSelect },
    },
  },
  suppliers: {
    modelName: 'supplier',
    searchFields: ['supplierName', 'contactPerson', 'mobile', 'email', 'gstNumber', 'city'],
    booleanFields: ['status'],
  },
  inventory: {
    modelName: 'inventory',
    searchFields: ['location'],
    intFields: ['stockQuantity', 'reservedQuantity', 'lowStockThreshold'],
    include: {
      product: { select: productSelect },
      supplier: { select: { id: true, supplierName: true } },
    },
  },
  engineers: {
    modelName: 'engineer',
    searchFields: ['name', 'mobile', 'email'],
    booleanFields: ['active'],
    numberFields: ['rating'],
    jsonFields: ['skills', 'currentLocation'],
    include: {
      user: { select: userSelect },
      serviceTickets: { select: { id: true, status: true } },
    },
  },
  'engineer-attendance': {
    modelName: 'engineerAttendance',
    searchFields: ['notes'],
    dateFields: ['attendanceDate', 'checkInAt', 'checkOutAt'],
    numberFields: ['latitude', 'longitude'],
    include: { engineer: { select: engineerSelect } },
  },
  'service-tickets': {
    modelName: 'serviceTicket',
    searchFields: ['ticketNumber', 'issue', 'resolution', 'priority'],
    softDelete: true,
    numberFields: ['serviceCharges'],
    jsonFields: ['partsUsed'],
    dateFields: ['visitDate'],
    sequence: { field: 'ticketNumber', prefix: 'SRV' },
    include: {
      customer: { select: customerSelect },
      product: { select: productSelect },
      engineer: { select: engineerSelect },
    },
  },
  'service-visits': {
    modelName: 'serviceVisit',
    searchFields: ['issue', 'resolution', 'customerFeedback'],
    numberFields: ['serviceCharges'],
    intFields: ['customerRating'],
    jsonFields: ['partsUsed'],
    dateFields: ['visitDate'],
    include: {
      serviceTicket: { select: { id: true, ticketNumber: true, status: true } },
      customer: { select: customerSelect },
      product: { select: productSelect },
      engineer: { select: engineerSelect },
    },
  },
  'amc-plans': {
    modelName: 'amcPlan',
    searchFields: ['name', 'description'],
    numberFields: ['price'],
    intFields: ['durationMonths', 'includedVisits'],
    jsonFields: ['includedParts'],
    booleanFields: ['active'],
  },
  'customer-amc': {
    modelName: 'customerAmc',
    searchFields: [],
    numberFields: ['price'],
    intFields: ['includedVisits', 'usedVisits'],
    jsonFields: ['includedParts'],
    dateFields: ['startDate', 'endDate', 'nextServiceDate'],
    include: {
      customer: { select: customerSelect },
      product: { select: productSelect },
      plan: { select: { id: true, name: true, tier: true } },
      engineer: { select: engineerSelect },
    },
  },
  orders: {
    modelName: 'order',
    searchFields: ['orderNumber', 'notes'],
    softDelete: true,
    numberFields: ['subtotal', 'discountTotal', 'taxTotal', 'grandTotal', 'dueAmount'],
    sequence: { field: 'orderNumber', prefix: 'ORD' },
    include: {
      customer: { select: customerSelect },
      lead: { select: { id: true, leadNumber: true, name: true } },
      items: true,
      payments: true,
    },
  },
  'order-items': {
    modelName: 'orderItem',
    searchFields: ['itemName', 'sku'],
    intFields: ['quantity'],
    numberFields: ['unitPrice', 'total'],
    include: {
      order: { select: { id: true, orderNumber: true } },
      product: { select: productSelect },
    },
  },
  payments: {
    modelName: 'payment',
    searchFields: ['paymentNumber', 'transactionId', 'notes'],
    numberFields: ['amount'],
    dateFields: ['paidAt', 'dueDate'],
    sequence: { field: 'paymentNumber', prefix: 'PAY' },
    include: {
      customer: { select: customerSelect },
      order: { select: { id: true, orderNumber: true } },
    },
  },
  notifications: {
    modelName: 'notification',
    searchFields: ['title', 'message'],
    booleanFields: ['isRead'],
    jsonFields: ['payload'],
    dateFields: ['readAt'],
    include: { user: { select: userSelect } },
  },
  invoices: {
    modelName: 'invoice',
    searchFields: ['invoiceNumber', 'pdfUrl'],
    numberFields: ['amount'],
    dateFields: ['issuedAt', 'dueAt'],
    sequence: { field: 'invoiceNumber', prefix: 'INV' },
    include: {
      customer: { select: customerSelect },
      order: { select: { id: true, orderNumber: true } },
    },
  },
  quotations: {
    modelName: 'quotation',
    searchFields: ['quotationNumber', 'pdfUrl'],
    numberFields: ['amount'],
    dateFields: ['validUntil'],
    sequence: { field: 'quotationNumber', prefix: 'QTN' },
    include: {
      lead: { select: { id: true, leadNumber: true, name: true } },
      customer: { select: customerSelect },
      order: { select: { id: true, orderNumber: true } },
    },
  },
  'website-settings': {
    modelName: 'websiteSetting',
    searchFields: ['group', 'key'],
    jsonFields: ['value'],
    booleanFields: ['isPublic'],
  },
  settings: {
    modelName: 'websiteSetting',
    searchFields: ['group', 'key'],
    jsonFields: ['value'],
    booleanFields: ['isPublic'],
  },
  banners: {
    modelName: 'banner',
    searchFields: ['title', 'imageUrl', 'linkUrl'],
    intFields: ['sortOrder'],
    booleanFields: ['isEnabled'],
    dateFields: ['startsAt', 'endsAt'],
  },
  testimonials: {
    modelName: 'testimonial',
    searchFields: ['customerName', 'message'],
    intFields: ['rating', 'sortOrder'],
    booleanFields: ['isPublished'],
  },
  faqs: {
    modelName: 'faq',
    searchFields: ['question', 'answer', 'category'],
    intFields: ['sortOrder'],
    booleanFields: ['isPublished'],
  },
  blogs: {
    modelName: 'blog',
    searchFields: ['title', 'slug', 'excerpt', 'content'],
    dateFields: ['publishedAt'],
  },
  users: {
    modelName: 'user',
    searchFields: ['name', 'email', 'phone'],
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
  roles: {
    modelName: 'role',
    searchFields: ['name', 'slug'],
    include: { permissions: { include: { permission: true } } },
  },
  permissions: {
    modelName: 'permission',
    searchFields: ['name', 'slug', 'module'],
  },
  'user-sessions': {
    modelName: 'userSession',
    searchFields: ['deviceName', 'deviceType', 'ipAddress', 'userAgent'],
    dateFields: ['lastSeenAt', 'expiresAt', 'revokedAt'],
    include: { user: { select: userSelect } },
  },
  'login-history': {
    modelName: 'loginHistory',
    searchFields: ['email', 'reason', 'ipAddress', 'userAgent', 'deviceName'],
    include: { user: { select: userSelect } },
  },
  'activity-logs': {
    modelName: 'activityLog',
    searchFields: ['module', 'action', 'entity'],
    jsonFields: ['metadata'],
    include: { user: { select: userSelect } },
  },
};

module.exports = resourceConfigs;
