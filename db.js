const fs = require('fs');
const path = require('path');

const DB_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DB_DIR, 'database.json');

// Default initial database state with seed data
const DEFAULT_DATA = {
  users: [
    {
      id: 'usr-demo-merchant',
      role: 'MERCHANT',
      name: 'Sunita Sharma',
      email: 'kusum@localbiz.com',
      phone: '+91 98765 43210',
      address: 'Shop 14, Main Market, Civil Lines, Delhi',
      password: 'password123',
      createdAt: '2026-07-26T00:00:00.000Z',
    },
    {
      id: 'usr-demo-customer',
      role: 'CUSTOMER',
      name: 'Rahul Verma',
      email: 'rahul@example.com',
      phone: '+91 98111 22222',
      address: 'Flat 402, Green Park, New Delhi',
      password: 'password123',
      createdAt: '2026-07-26T00:00:00.000Z',
    },
  ],
  shops: [
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
  ],
  products: [
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
  ],
  orders: [
    {
      id: 'ORD-8801',
      customerName: 'Rahul Verma',
      customerPhone: '+91 98111 22222',
      shopSlug: 'kusum-medical',
      total: 320,
      status: 'PENDING',
      items: ['Paracetamol 650mg x2', 'Cough Syrup x1'],
      createdAt: '2026-07-26T12:00:00.000Z',
    },
  ],
};

// Ensure data folder and database.json exist
function initDb() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DATA, null, 2), 'utf8');
  }
}

// Read database
function readDb() {
  initDb();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database file:', err);
    return DEFAULT_DATA;
  }
}

// Write database
function writeDb(data) {
  initDb();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing to database file:', err);
  }
}

// User CRUD Operations
function getUsers() {
  const db = readDb();
  return db.users || [];
}

function findUserByEmail(email) {
  const users = getUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

function addUser(user) {
  const db = readDb();
  db.users.push(user);
  writeDb(db);
  return user;
}

// Shop CRUD Operations
function getShops() {
  const db = readDb();
  return db.shops || [];
}

function findShopBySlug(slug) {
  const shops = getShops();
  return shops.find((s) => s.slug === slug);
}

function addShop(shop) {
  const db = readDb();
  db.shops.unshift(shop);
  writeDb(db);
  return shop;
}

// Product CRUD Operations
function getProducts() {
  const db = readDb();
  return db.products || [];
}

// Order CRUD Operations
function getOrders() {
  const db = readDb();
  return db.orders || [];
}

function addOrder(order) {
  const db = readDb();
  db.orders.unshift(order);
  writeDb(db);
  return order;
}

function updateOrderStatus(id, status) {
  const db = readDb();
  const order = db.orders.find((o) => o.id === id);
  if (order) {
    order.status = status;
    writeDb(db);
  }
  return order;
}

module.exports = {
  initDb,
  getUsers,
  findUserByEmail,
  addUser,
  getShops,
  findShopBySlug,
  addShop,
  getProducts,
  getOrders,
  addOrder,
  updateOrderStatus,
};
