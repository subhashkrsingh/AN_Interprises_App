const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const { body, validationResult } = require('express-validator');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const CONTACTS_FILE = path.join(__dirname, 'contacts.json');

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

const services = [
  {
    id: 1,
    title: 'RO Water Purifier Sales',
    description: 'Premium RO systems designed for home, office and commercial spaces.',
    icon: '💧'
  },
  {
    id: 2,
    title: 'RO Installation Service',
    description: 'Fast and safe installation from certified RO technicians.',
    icon: '🛠️'
  },
  {
    id: 3,
    title: 'RO Repair & Maintenance',
    description: 'Quick diagnostics and repair for all RO purifier models.',
    icon: '🔧'
  },
  {
    id: 4,
    title: 'Filter & Membrane Replacement',
    description: 'Genuine spare parts and filter replacement plans.',
    icon: '🔁'
  }
];

const products = [
  {
    id: 1,
    name: 'Domestic RO Water Purifier',
    description: 'Compact systems ideal for family kitchens.',
    category: 'Domestic'
  },
  {
    id: 2,
    name: 'Commercial RO Plant',
    description: 'High-capacity solution for offices, schools and restaurants.',
    category: 'Commercial'
  },
  {
    id: 3,
    name: 'Smart RO Systems',
    description: 'Connected RO systems with monitor-friendly controls.',
    category: 'Smart'
  }
];

const testimonials = [
  {
    id: 1,
    text: 'The installation team was professional and the water tastes amazing. Highly recommended!',
    rating: 5,
    author: 'Rhea S.'
  },
  {
    id: 2,
    text: 'Fast service and great support. Our office RO works flawlessly.',
    rating: 5,
    author: 'Vikram K.'
  },
  {
    id: 3,
    text: 'Affordable AMC plans and genuine filters. Very happy with the after-sales care.',
    rating: 5,
    author: 'Anjali M.'
  }
];

const faqs = [
  {
    id: 1,
    question: 'Why is RO water purification important?',
    answer: 'RO purification removes contaminants and ensures safe drinking water by filtering out dissolved solids, bacteria and impurities.'
  },
  {
    id: 2,
    question: 'How often should RO filters be replaced?',
    answer: 'We recommend replacing RO filters every 6-12 months depending on usage and water quality to maintain peak performance.'
  },
  {
    id: 3,
    question: 'Do you provide doorstep service?',
    answer: 'Yes, we offer doorstep installation, repair, maintenance and AMC services across our service area.'
  }
];

async function loadContacts() {
  try {
    const data = await fs.readFile(CONTACTS_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function saveContacts(contacts) {
  await fs.writeFile(CONTACTS_FILE, JSON.stringify(contacts, null, 2), 'utf8');
}

app.get('/api/services', (req, res) => {
  res.json(services);
});

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/testimonials', (req, res) => {
  res.json(testimonials);
});

app.get('/api/faqs', (req, res) => {
  res.json(faqs);
});

app.post(
  '/api/contact',
  [
    body('name').trim().notEmpty().withMessage('Name is required.'),
    body('phone').trim().notEmpty().withMessage('Phone is required.'),
    body('email').trim().isEmail().withMessage('Valid email is required.'),
    body('serviceType').trim().notEmpty().withMessage('Service type is required.'),
    body('message').trim().notEmpty().withMessage('Message is required.')
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    const { name, phone, email, serviceType, message } = req.body;
    try {
      const contacts = await loadContacts();
      contacts.push({ id: Date.now(), name, phone, email, serviceType, message, createdAt: new Date().toISOString() });
      await saveContacts(contacts);
      res.json({ success: true, message: "We'll contact you shortly!" });
    } catch (error) {
      next(error);
    }
  }
);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
