const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

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

// Mock Data
const SHOPS = [
  {
    id: 'b1',
    name: 'Kusum Medical Store',
    slug: 'kusum-medical',
    category: 'Medical',
    description: '24/7 Licensed Pharmacy providing authentic medicines, healthcare products, surgical supplies, and online prescription delivery.',
    logo: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&q=80&w=300',
    banner: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=1200',
    phone: '+91 98765 43210',
    whatsappNumber: '919876543210',
    address: 'Shop 14, Main Market, Civil Lines, Delhi - 110054',
    rating: 4.9,
    reviews: 128,
    isVerified: true,
    isHolidayMode: false,
  },
  {
    id: 'b2',
    name: 'Sharma Organic Grocery',
    slug: 'sharma-grocery',
    category: 'Grocery',
    description: 'Fresh farm vegetables, organic pulses, pure dairy, spices, and daily household essentials delivered to your doorstep in 30 minutes.',
    logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300',
    banner: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=1200',
    phone: '+91 98112 34567',
    whatsappNumber: '919811234567',
    address: 'Block C, Sector 18, Noida - 201301',
    rating: 4.8,
    reviews: 95,
    isVerified: true,
    isHolidayMode: false,
  },
  {
    id: 'b3',
    name: 'RK Electronics & Mobile Repair',
    slug: 'rk-electronics',
    category: 'Electronics',
    description: 'Authorized smartphone repair, laptop accessories, smart TVs, soundbars, and home appliance repair services with genuine warranty.',
    logo: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=300',
    banner: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&q=80&w=1200',
    phone: '+91 99990 12345',
    whatsappNumber: '919999012345',
    address: 'Shop 8, Electronic Complex, Laxmi Nagar, Delhi',
    rating: 4.7,
    reviews: 64,
    isVerified: true,
    isHolidayMode: false,
  },
];

const PRODUCTS = [
  {
    id: 'p1',
    shopSlug: 'kusum-medical',
    name: 'Paracetamol 650mg Tablets (Strip of 15)',
    price: 32,
    offerPrice: 28,
    unit: 'strip',
    category: 'Medicines',
    isPrescriptionRequired: false,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400',
    description: 'Fast relief from fever, body pain, and mild headaches.',
  },
  {
    id: 'p2',
    shopSlug: 'kusum-medical',
    name: 'Amoxicillin 500mg Antibiotic Capsules',
    price: 110,
    offerPrice: 95,
    unit: 'strip',
    category: 'Prescription Drugs',
    isPrescriptionRequired: true,
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=400',
    description: 'Broad-spectrum penicillin antibiotic. Doctor prescription required.',
  },
  {
    id: 'p3',
    shopSlug: 'sharma-grocery',
    name: 'Pure Organic Cow Milk 1L Bottle',
    price: 65,
    offerPrice: 65,
    unit: 'bottle',
    category: 'Dairy',
    isPrescriptionRequired: false,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=400',
    description: 'Unpasteurized fresh farm milk delivered straight from trusted local pastures.',
  },
  {
    id: 'p4',
    shopSlug: 'sharma-grocery',
    name: 'Farm Fresh Organic Tomatoes (1kg)',
    price: 40,
    offerPrice: 34,
    unit: 'kg',
    category: 'Vegetables',
    isPrescriptionRequired: false,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400',
    description: 'Naturally grown juicy red tomatoes free from chemical pesticides.',
  },
  {
    id: 'p5',
    shopSlug: 'rk-electronics',
    name: 'Fast Charging USB-C Braided Cable 65W',
    price: 399,
    offerPrice: 299,
    unit: 'piece',
    category: 'Accessories',
    isPrescriptionRequired: false,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=400',
    description: 'Heavy duty 1.5m nylon braided cable with 1 year warranty.',
  },
];

let ORDERS = [
  {
    id: 'ORD-8801',
    customerName: 'Rahul Verma',
    customerPhone: '+91 98765 11111',
    shopSlug: 'kusum-medical',
    total: 320,
    status: 'PENDING',
    items: ['Paracetamol 650mg x2', 'Cough Syrup x1'],
    createdAt: new Date().toISOString(),
  },
];

// --- REST API ENDPOINTS ---

// GET /api/shops - Fetch all shops
app.get('/api/shops', (req, res) => {
  const { category, search } = req.query;
  let result = [...SHOPS];

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
  const shop = SHOPS.find((s) => s.slug === req.params.slug) || SHOPS[0];
  const products = PRODUCTS.filter((p) => p.shopSlug === shop.slug || shop.slug === 'kusum-medical');
  res.json({ success: true, shop, products });
});

// POST /api/prescriptions/upload - Handle file upload
app.post('/api/prescriptions/upload', upload.single('prescription'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No prescription file uploaded' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, message: 'Prescription uploaded successfully', fileUrl });
});

// POST /api/orders - Place customer order
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
  ORDERS.unshift(newOrder);
  res.status(201).json({ success: true, message: 'Order placed successfully', order: newOrder });
});

// GET /api/merchant/orders - Merchant list orders
app.get('/api/merchant/orders', (req, res) => {
  res.json({ success: true, orders: ORDERS });
});

// POST /api/merchant/orders/:id/status - Update order status
app.post('/api/merchant/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const order = ORDERS.find((o) => o.id === req.params.id);
  if (order) {
    order.status = status;
    return res.json({ success: true, order });
  }
  res.status(404).json({ success: false, message: 'Order not found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 LocalBiz Platform Server running on http://localhost:${PORT}`);
  console.log(`=================================================`);
});
