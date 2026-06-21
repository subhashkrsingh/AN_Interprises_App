const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const fs = require('fs').promises;
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables early
require('dotenv').config();

// Validate required environment variables before anything else
const validateEnvironment = () => {
  const required = {
    JWT_SECRET: 'JWT_SECRET',
    JWT_REFRESH_SECRET: 'JWT_REFRESH_SECRET',
    DATABASE_URL: 'DATABASE_URL',
    CLIENT_ORIGIN: 'CLIENT_ORIGIN',
    GOOGLE_CLIENT_ID: 'GOOGLE_CLIENT_ID',
    PORT: 'PORT (optional, defaults to 5000)',
  };

  const missing = Object.entries(required)
    .filter(([key]) => !process.env[key])
    .map(([_, display]) => display);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(v => console.error(`   - ${v}`));
    console.error('\nPlease check your .env file and ensure all variables are set.');
    process.exit(1);
  }

  console.log('✅ Environment variables validated');
};

validateEnvironment();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const CONTACTS_FILE = path.join(__dirname, 'contacts.json');

const services = [
  {
    id: 1,
    title: "RO Water Purifier Sales",
    description: "Premium RO systems designed for home, office and commercial spaces.",
    icon: "💧",
    price: "₹10,999",
  },
  {
    id: 2,
    title: "RO Installation Service",
    description: "Fast and safe installation from certified RO technicians.",
    icon: "🛠️",
    price: "₹2,499",
  },
  {
    id: 3,
    title: "RO Repair & Maintenance",
    description: "Quick diagnostics and repair for all RO purifier models.",
    icon: "🔧",
    price: "₹1,999",
  },
  {
    id: 4,
    title: "Filter & Membrane Replacement",
    description: "Genuine spare parts and filter replacement plans.",
    icon: "🔁",
    price: "₹2,999",
  },
];

const products = [
  {
    id: 1,
    name: "Domestic RO Water Purifier",
    description: "Compact systems ideal for family kitchens.",
    category: "Domestic",
    price: "₹12,999",
    quantity: 1,
  },
  {
    id: 2,
    name: "Commercial RO Plant",
    description: "High-capacity solution for offices, schools and restaurants.",
    category: "Commercial",
    price: "₹49,999",
    quantity: 1,
  },
  {
    id: 3,
    name: "Smart RO Systems",
    description: "Connected RO systems with monitor-friendly controls.",
    category: "Smart",
    price: "₹24,999",
    quantity: 1,
  },
];

const testimonials = [
  {
    id: 1,
    text: "The installation team was professional and the water tastes amazing. Highly recommended!",
    rating: 5,
    author: "Rhea S.",
  },
  {
    id: 2,
    text: "Fast service and great support. Our office RO works flawlessly.",
    rating: 5,
    author: "Vikram K.",
  },
  {
    id: 3,
    text: "Affordable AMC plans and genuine filters. Very happy with the after-sales care.",
    rating: 5,
    author: "Anjali M.",
  },
];

const faqs = [
  {
    id: 1,
    question: "Why is RO water purification important?",
    answer: "RO purification removes contaminants and ensures safe drinking water by filtering out dissolved solids, bacteria and impurities.",
  },
  {
    id: 2,
    question: "How often should RO filters be replaced?",
    answer: "We recommend replacing RO filters every 6-12 months depending on usage and water quality to maintain peak performance.",
  },
  {
    id: 3,
    question: "Do you provide doorstep service?",
    answer: "Yes, we offer doorstep installation, repair, maintenance and AMC services across our service area.",
  },
];

const loadContacts = async () => {
  try {
    const data = await fs.readFile(CONTACTS_FILE, "utf8");
    return JSON.parse(data || "[]");
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
};

const saveContacts = async (contacts) => {
  await fs.writeFile(CONTACTS_FILE, JSON.stringify(contacts, null, 2), "utf8");
};

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);

console.log('🚀 Auth endpoints mounted under /api/auth');
console.log('   - POST /api/auth/login');
console.log('   - POST /api/auth/register');
console.log('   - POST /api/auth/refresh');
console.log('   - POST /api/auth/logout');
console.log('   - GET  /api/auth/me');

app.get("/api/services", (req, res) => res.json(services));
app.get("/api/products", (req, res) => res.json(products));
app.get("/api/testimonials", (req, res) => res.json(testimonials));
app.get("/api/faqs", (req, res) => res.json(faqs));

app.post('/api/contact', async (req, res, next) => {
  const { name, phone, email, serviceType, message } = req.body;
  if (!name || !phone || !email || !serviceType || !message) {
    return res.status(422).json({ success: false, message: "Please fill out all contact fields." });
  }

  try {
    const contacts = await loadContacts();
    contacts.push({
      id: Date.now(),
      name,
      phone,
      email,
      serviceType,
      message,
      createdAt: new Date().toISOString(),
    });
    await saveContacts(contacts);
    res.json({ success: true, message: "We'll contact you shortly!" });
  } catch (error) {
    next(error);
  }
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Resource not found.' });
});

app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();
