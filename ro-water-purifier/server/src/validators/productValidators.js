const { body } = require('express-validator');

const productRules = [
  body('name').trim().notEmpty().withMessage('Product name is required.'),
  body('sku').trim().notEmpty().withMessage('SKU is required.'),
  body('productType')
    .optional()
    .isIn(['RO_PURIFIER', 'WATER_SOFTENER', 'COMMERCIAL_RO_PLANT', 'SPARE_PART', 'FILTER', 'MEMBRANE', 'PUMP', 'UV_KIT'])
    .withMessage('Product type is invalid.'),
  body('slug').optional({ checkFalsy: true }).trim(),
  body('categoryId').notEmpty().withMessage('Category is required.'),
  body('mrp').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('MRP must be valid.'),
  body('price').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Price must be valid.'),
  body('salePrice').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Sale price must be valid.'),
  body('costPrice').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Cost price must be valid.'),
  body('stockQuantity').optional().isInt({ min: 0 }).withMessage('Stock quantity must be valid.'),
  body('warrantyMonths').optional({ checkFalsy: true }).isInt({ min: 0 }).withMessage('Warranty must be valid.'),
];

module.exports = { productRules };
