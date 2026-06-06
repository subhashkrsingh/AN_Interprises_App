const prisma = require('../config/prisma');

function toCsv(rows) {
  if (!rows.length) return '';
  const columns = Object.keys(rows[0]);
  const escape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
  return [columns.join(','), ...rows.map((row) => columns.map((column) => escape(row[column])).join(','))].join('\n');
}

async function toExcel(rows) {
  const ExcelJS = require('exceljs');
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Report');
  worksheet.columns = Object.keys(rows[0] || { message: 'No data' }).map((key) => ({
    header: key,
    key,
    width: Math.max(16, key.length + 4),
  }));
  rows.forEach((row) => worksheet.addRow(row));
  worksheet.getRow(1).font = { bold: true };
  return workbook.xlsx.writeBuffer();
}

async function toPdf(rows, title) {
  const PDFDocument = require('pdfkit');
  const chunks = [];
  const doc = new PDFDocument({ margin: 40 });

  doc.on('data', (chunk) => chunks.push(chunk));
  doc.fontSize(18).text(title, { underline: true });
  doc.moveDown();

  rows.slice(0, 200).forEach((row, index) => {
    doc.fontSize(10).text(`${index + 1}. ${JSON.stringify(row)}`);
    doc.moveDown(0.4);
  });

  doc.end();

  return new Promise((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

async function getReport(type = 'sales') {
  if (type === 'inventory') {
    return prisma.inventory.findMany({
      include: { product: { select: { name: true, sku: true } } },
      orderBy: { updatedAt: 'desc' },
    });
  }

  if (type === 'customers') {
    return prisma.customer.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        status: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  if (type === 'products') {
    return prisma.product.findMany({
      select: {
        id: true,
        name: true,
        sku: true,
        price: true,
        salePrice: true,
        stockQuantity: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  return prisma.order.findMany({
    include: { customer: { select: { firstName: true, lastName: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

async function exportReport(type, format) {
  const rows = await getReport(type);
  const flatRows = rows.map((row) => ({
    id: row.id,
    reference: row.orderNumber || row.sku || row.product?.sku || row.email || row.productId || '',
    name: row.name || row.product?.name || [row.firstName, row.lastName].filter(Boolean).join(' ') || '',
    status: row.status || row.stockStatus || '',
    total: row.grandTotal || row.price || row.stockQuantity || '',
    createdAt: row.createdAt,
  }));

  if (format === 'excel') {
    return {
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      extension: 'xlsx',
      body: await toExcel(flatRows),
    };
  }

  if (format === 'pdf') {
    return {
      mimeType: 'application/pdf',
      extension: 'pdf',
      body: await toPdf(flatRows, `${type || 'sales'} report`),
    };
  }

  if (format === 'json') return { mimeType: 'application/json', body: JSON.stringify(flatRows, null, 2) };
  return { mimeType: 'text/csv', extension: 'csv', body: toCsv(flatRows) };
}

module.exports = { getReport, exportReport };
