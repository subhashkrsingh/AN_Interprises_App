const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();
const contactsFile = path.resolve(__dirname, '../../contacts.json');

const services = [
  {
    id: 1,
    title: 'RO Water Purifier Sales',
    description: 'Premium RO systems for homes and businesses.',
    price: 'Rs. 10,999',
    image: '/images/services/ro-sales.svg',
    icon: '🚰',
  },
  {
    id: 2,
    title: 'RO Installation Service',
    description: 'Safe installation from certified technicians.',
    price: 'Rs. 2,499',
    image: '/images/services/ro-installation.svg',
    icon: '🔧',
  },
  {
    id: 3,
    title: 'RO Repair & Maintenance',
    description: 'Diagnostics, repair and AMC support.',
    price: 'Rs. 1,999',
    image: '/images/services/ro-repair.svg',
    icon: '🛠️',
  },
  {
    id: 4,
    title: 'Filter & Membrane Replacement',
    description: 'Genuine spare parts with doorstep replacement.',
    price: 'Rs. 1,499',
    image: '/images/services/ro-filter.svg',
    icon: '🧪',
  },
  {
    id: 5,
    title: 'AMC Plans',
    description: 'Annual maintenance contracts for worry-free service.',
    price: 'Rs. 4,999 / yr',
    image: '/images/services/ro-amc.svg',
    icon: '📅',
  },
  {
    id: 6,
    title: 'Water TDS Testing',
    description: 'On-site water quality testing and consultation.',
    price: 'Free',
    image: '/images/services/ro-tds.svg',
    icon: '💧',
  },
];

const products = [
  { id: 1, name: 'Domestic RO Water Purifier', category: 'Domestic', price: 'Rs. 12,999', quantity: 1 },
  { id: 2, name: 'Commercial RO Plant', category: 'Commercial', price: 'Rs. 49,999', quantity: 1 },
  { id: 3, name: 'Smart RO Systems', category: 'Smart', price: 'Rs. 24,999', quantity: 1 },
];

router.get('/services', (req, res) => res.json(services));
router.get('/products', (req, res) => res.json(products));
router.get('/testimonials', (req, res) => res.json([]));
router.get('/faqs', (req, res) => res.json([]));

router.post(
  '/contact',
  asyncHandler(async (req, res) => {
    const contacts = await fs
      .readFile(contactsFile, 'utf8')
      .then((data) => JSON.parse(data || '[]'))
      .catch(() => []);

    contacts.push({ id: Date.now(), ...req.body, createdAt: new Date().toISOString() });
    await fs.writeFile(contactsFile, JSON.stringify(contacts, null, 2), 'utf8');
    res.json({ success: true, message: "We'll contact you shortly!" });
  })
);

module.exports = router;
