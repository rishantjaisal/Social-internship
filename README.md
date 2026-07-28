# 🏪 LocalBiz — Empowering Every Local Business to Go Digital

> **Tagline**: *"Empowering Every Local Business to Go Digital."*  
> **Live Web Application**: [https://local-bizzness.netlify.app](https://local-bizzness.netlify.app)  
> **GitHub Repository**: [https://github.com/rishantjaisal/Social-internship](https://github.com/rishantjaisal/Social-internship)

---

## 🌟 Overview

**LocalBiz** is a startup-quality hyper-local digital storefront SaaS platform engineered to empower small neighborhood businesses — pharmacies, organic grocery markets, electronics repair shops, salons, bakeries, and hardware stores — to establish instant online storefronts without paying high commissions.

Unlike traditional delivery aggregators that charge 25%–30% fees per transaction, **LocalBiz** provides a **0% commission direct-to-merchant platform** featuring 1-click WhatsApp order checkout, real-time GPS proximity distance calculation, prescription upload verification, and a persistent database.

---

## 🚀 Key Features

### 📍 1. Real-Time GPS Geolocation & Haversine Proximity Sorting
- **HTML5 Geolocation API**: Locates user device coordinates with high accuracy.
- **Haversine Distance Engine**: Calculates exact distance in kilometers (`📍 0.8 km away`) between the buyer and nearby merchants.
- **Automatic Distance Sorting**: Re-orders local stores by closest proximity first.

### 🏪 2. Store Owner (Merchant) Portal & Customization
- **Dual Merchant & Customer Registration**: Separate onboarding flows for store owners and customers (`register.html`).
- **Storefront Customization**: Merchants can update profile logo pictures, header banner images, business category, shop address, and contact details (`merchant.html`).
- **Live Order Management**: Real-time dashboard for merchants to accept incoming orders, mark items as delivered, and toggle **Holiday Mode**.

### 💊 3. Prescription Upload & Pharmacy Integration
- **1-Click Prescription Upload**: Customers buying prescription-required drugs from licensed pharmacies (e.g. *Kusum Medical Store*) can upload doctor notes (`/api/prescriptions/upload`).
- **Pharmacist Review Flow**: Orders require licensed pharmacist verification prior to dispatch.

### 💬 4. 1-Click WhatsApp Direct Checkout
- Converts cart items into formatted WhatsApp orders sent directly to the merchant’s phone number, eliminating middleman fees.

### 💾 5. Persistent Disk Database
- **Zero-Config Database Engine (`db.js`)**: Automatically persists all registered users (customers & store owners), storefront profiles, products, and order logs to disk at `data/database.json`.

### 🎤 6. Web Speech API Voice Search
- Voice recognition modal allowing hands-free product searching for medicines, groceries, or repair services.

### 💰 7. Interactive Merchant Profit Calculator & Coupon Ticker
- **Savings Calculator**: Interactive slider calculating monthly profit retained under LocalBiz’s 0% commission vs 30% aggregator fees.
- **Promo Coupon Codes**: Copyable discount codes (`LOCAL100`, `HEALTH20`, `FREEDEL`).
- **Live Order Notification Ticker**: Real-time floating ticker displaying recent neighborhood purchases.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Core** | HTML5, Vanilla JavaScript (ES6+), FontAwesome 6 Icons |
| **Styling & Design** | Vanilla CSS3 (Custom Design System, Inter Font, Glassmorphism, Responsive Grid) |
| **Backend API** | Node.js, Express.js |
| **Security & Middleware** | Helmet.js, CORS, Multer (File Uploads) |
| **Database** | Persistent File-Backed JSON / SQLite DB Engine (`db.js` -> `data/database.json`) |
| **Hosting & Deployment** | Netlify (`netlify.toml`), Render / Vercel ready |

---

## 📁 Repository Directory Structure

```
localbiz-simple/
├── data/
│   └── database.json          # Persistent database file (Users, Shops, Products, Orders)
├── public/
│   ├── index.html             # Home directory & shop finder landing page
│   ├── shop.html              # Digital storefront view (Kusum Medical, Sharma Grocery, etc.)
│   ├── checkout.html          # Order submission & cart checkout page
│   ├── merchant.html          # Merchant owner dashboard & order management portal
│   ├── register.html          # Dual Customer & Merchant account registration
│   ├── login.html             # User authentication sign-in page
│   ├── styles.css             # Master design system & UI CSS stylesheets
│   ├── app.js                 # Main landing page logic (Geolocation, Search, Voice, FAQs)
│   ├── shop.js                # Storefront cart, Rx upload modal, WhatsApp builder
│   └── uploads/               # Prescription file uploads directory
├── server.js                  # Express REST API server & static asset hosting
├── db.js                      # Database CRUD operations module
├── netlify.toml               # Netlify deployment configuration
├── package.json               # Node.js project dependencies
└── README.md                  # Project documentation
```

---

## 💻 Local Development Setup

Follow these steps to run LocalBiz locally on your computer:

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- `npm` (Node Package Manager)

### Step 1: Clone Repository
```bash
git clone https://github.com/rishantjaisal/Social-internship.git
cd Social-internship
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start Development Server
```bash
npm start
```
*or*
```bash
node server.js
```

### Step 4: Open in Browser
Navigate to **`http://localhost:3000`** in your browser.

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/shops` | List all verified local storefronts (filters: `category`, `search`) |
| `GET` | `/api/shops/:slug` | Get shop details and product inventory |
| `POST` | `/api/auth/register` | Register new Customer or Merchant user account |
| `POST` | `/api/auth/login` | Authenticate user credentials |
| `POST` | `/api/merchant/store-settings` | Update store banner image & logo profile picture |
| `POST` | `/api/prescriptions/upload` | Upload doctor prescription photo (`multer`) |
| `POST` | `/api/orders` | Submit new customer order |
| `GET` | `/api/merchant/orders` | Fetch live incoming orders for merchant portal |
| `POST` | `/api/merchant/orders/:id/status` | Update order status (`ACCEPTED`, `DELIVERED`) |
| `GET` | `/api/users` | List all registered users (sanitized response) |

---

## 🌐 Netlify Deployment

This repository includes a pre-configured `netlify.toml` file for automatic deployment on **Netlify**:

```toml
[build]
  publish = "public"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

To deploy to Netlify:
1. Connect your GitHub repository **`rishantjaisal/Social-internship`** to Netlify.
2. Select **`main`** branch.
3. Build command: *(leave empty)* | Publish directory: **`public`**.
4. Deploy!

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 👤 Author

**Rishant Jaisal**  
- **GitHub**: [@rishantjaisal](https://github.com/rishantjaisal)  
- **Deployed App**: [https://local-bizzness.netlify.app](https://local-bizzness.netlify.app)
