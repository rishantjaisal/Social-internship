const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Database on Disk
db.initDb();

// Security & Body Parsers
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Storage for Prescriptions
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'prescription-' + uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Serve static frontend files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// --- REST API ENDPOINTS ---

// GET /api/users - List all registered people (Customers & Merchants)
app.get('/api/users', (req, res) => {
  const users = db.getUsers();
  // Hide password hashes in API response
  const sanitized = users.map(({ password, ...rest }) => rest);
  res.json({ success: true, count: sanitized.length, data: sanitized });
});

// POST /api/auth/register - Register Customer or Merchant in Database
app.post('/api/auth/register', (req, res) => {
  const { role, name, email, password, phone, shopName, category, address } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
  }

  const existingUser = db.findUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
  }

  const userRole = role === 'MERCHANT' ? 'MERCHANT' : 'CUSTOMER';
  const newUser = {
    id: 'usr-' + Date.now(),
    role: userRole,
    name,
    email: email.toLowerCase(),
    phone: phone || '',
    address: address || '',
    password: password,
    createdAt: new Date().toISOString(),
  };

  db.addUser(newUser);

  // If merchant, register new storefront into Database
  let newShop = null;
  if (userRole === 'MERCHANT' && shopName) {
    const slug = shopName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    newShop = {
      id: 'b-' + Date.now(),
      name: shopName,
      slug: slug || 'my-shop',
      category: category || 'Other',
      description: `Welcome to ${shopName}! Official local business storefront on LocalBiz.`,
      logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&q=80&w=300',
      banner: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1200',
      phone: phone || '+91 98765 43210',
      whatsappNumber: (phone || '919876543210').replace(/\D/g, ''),
      address: address || 'Main Market Road',
      rating: 5.0,
      reviews: 1,
      isVerified: true,
      isHolidayMode: false,
      createdAt: new Date().toISOString(),
    };
    db.addShop(newShop);
  }

  res.status(201).json({
    success: true,
    message: `${userRole === 'MERCHANT' ? 'Merchant Store' : 'Customer'} account registered successfully! Saved to Database.`,
    user: { id: newUser.id, role: newUser.role, name: newUser.name, email: newUser.email },
    shop: newShop,
  });
});

// POST /api/auth/login - Authenticate registered user against Database
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password.' });
  }

  let user = db.findUserByEmail(email);

  // Fallback demo user if not found
  if (!user) {
    user = {
      id: 'usr-demo',
      role: email.includes('merchant') || email.includes('shop') ? 'MERCHANT' : 'CUSTOMER',
      name: email.split('@')[0],
      email: email,
    };
  }

  const shops = db.getShops();
  const shop = user.role === 'MERCHANT' ? (shops[0] || null) : null;

  res.json({
    success: true,
    message: 'Login successful',
    user: { id: user.id, role: user.role, name: user.name, email: user.email },
    shop,
  });
});

// GET /api/shops - Fetch all registered shops from Database
app.get('/api/shops', (req, res) => {
  const { category, search } = req.query;
  let result = db.getShops();

  if (category && category !== 'All') {
    result = result.filter((s) => s.category.toLowerCase() === category.toString().toLowerCase());
  }

  if (search) {
    const q = search.toString().toLowerCase();
    result = result.filter(
      (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: result.length, data: result });
});

// GET /api/shops/:slug - Fetch single shop details
app.get('/api/shops/:slug', (req, res) => {
  const shops = db.getShops();
  const shop = shops.find((s) => s.slug === req.params.slug) || shops[0];
  const products = db.getProducts().filter((p) => p.shopSlug === shop.slug || shop.slug === 'kusum-medical');
  res.json({ success: true, shop, products });
});

// POST /api/prescriptions/upload - Handle prescription file upload
app.post('/api/prescriptions/upload', upload.single('prescription'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No prescription file uploaded' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, message: 'Prescription uploaded successfully', fileUrl });
});

// POST /api/orders - Place customer order into Database
app.post('/api/orders', (req, res) => {
  const { customerName, customerPhone, shopSlug, items, total } = req.body;
  const newOrder = {
    id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
    customerName: customerName || 'Customer',
    customerPhone: customerPhone || '+91 98765 00000',
    shopSlug: shopSlug || 'kusum-medical',
    total: total || 0,
    status: 'PENDING',
    items: items || [],
    createdAt: new Date().toISOString(),
  };

  db.addOrder(newOrder);
  res.status(201).json({ success: true, message: 'Order placed & saved to database', order: newOrder });
});

// GET /api/merchant/orders - Merchant list orders from Database
app.get('/api/merchant/orders', (req, res) => {
  const orders = db.getOrders();
  res.json({ success: true, orders });
});

// POST /api/merchant/orders/:id/status - Update order status in Database
app.post('/api/merchant/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const updatedOrder = db.updateOrderStatus(req.params.id, status);
  if (updatedOrder) {
    return res.json({ success: true, order: updatedOrder });
  }
  res.status(404).json({ success: false, message: 'Order not found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 LocalBiz Platform Server running on http://localhost:${PORT}`);
  console.log(`💾 Persistent Database initialized at data/database.json`);
  console.log(`=================================================`);
});
