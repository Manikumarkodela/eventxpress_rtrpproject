# 🎉 EventXpress — Smart Event Vendor Booking Platform

EventXpress is a modern, full-stack web application designed to simplify event planning by instantly connecting customers with top-rated event professionals (vendors). Built with a **React (Vite)** frontend and a **Node.js/Express** backend, it provides a seamless marketplace for discovering, comparing, and booking event services across multiple cities.

---

## ✨ Key Features

### For Customers
- **Browse Live Services** — View all vendor-listed services with real-time data from the database
- **Smart Filtering** — Filter services by **name search**, **category** (Photography, Decoration, Catering, Event Planning, Venues), and **location** (Hyderabad, Warangal)
- **One-Click Booking** — Book any service directly with JWT-authenticated API calls
- **User Profile** — View account details, session info, and membership status
- **Responsive Design** — Fully optimized for desktop and mobile devices

### For Vendors
- **Vendor Dashboard** — A dedicated workspace to manage all service listings
- **Add Services** — Create listings with name, price, description, category, location, and contact info
- **Portfolio Image Upload** — Upload up to 5 images per service, stored securely on **Cloudinary**
- **Delete Listings** — Remove services with ownership verification (only your own listings)
- **Live Preview** — See your active listings alongside the creation form

### Platform-Wide
- **Role-Based Authentication** — Separate registration and login flows for Customers and Vendors
- **JWT Security** — Token-based auth with expiry checks and secure middleware
- **Auto-Rotating Carousel** — Hero section with marriage, birthday, and corporate event imagery
- **Blog Section** — Event planning insights with tips, guides, and inspiration articles
- **Professional Footer** — Quick links, support, contact info, and social media links

---

## 🏗️ Architecture

```
rtrppro/
├── backend/                    # Express.js REST API
│   ├── config/
│   │   ├── db.js               # MongoDB connection (Mongoose)
│   │   └── cloudinary.js       # Cloudinary + Multer storage config
│   ├── controllers/
│   │   ├── authController.js   # Register & Login logic
│   │   ├── vendorController.js # CRUD for vendor products/services
│   │   └── orderController.js  # Booking/order creation & retrieval
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT verification + vendor role guard
│   ├── models/
│   │   ├── User.js             # name, email, password, role
│   │   ├── Product.js          # name, price, desc, category, location, images, vendorId
│   │   └── Order.js            # customerId, vendorId, products[]
│   ├── routes/
│   │   ├── authRoutes.js       # POST /register, POST /login
│   │   ├── vendorRoutes.js     # GET/POST/DELETE /products, GET /my-products
│   │   └── orderRoutes.js      # POST /order, GET /order
│   ├── server.js               # Express app entry point
│   ├── package.json
│   └── .env                    # Environment variables (not committed)
│
├── frontend/                   # React SPA (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Fixed navbar with auth state, user dropdown
│   │   │   ├── Footer.jsx      # Universal site footer
│   │   │   └── ServiceCard.jsx # Reusable service/product card with booking
│   │   ├── pages/
│   │   │   ├── Home.jsx        # Carousel, popular events, live services, blog
│   │   │   ├── Login.jsx       # Email/password login with role switcher
│   │   │   ├── Signup.jsx      # New account registration with role selection
│   │   │   ├── Profile.jsx     # User profile with stats and membership info
│   │   │   └── VendorDashboard.jsx  # Service CRUD + image upload dashboard
│   │   ├── images/             # Static event images (marriage, birthday, corporate, etc.)
│   │   ├── style.css           # Complete design system (~1370 lines)
│   │   ├── index.css           # Global reset
│   │   ├── main.jsx            # React entry point
│   │   └── App.jsx             # Router with all page routes
│   ├── index.html              # Vite entry HTML with fonts & icons
│   ├── package.json
│   └── vite.config.js
│
├── images/                     # Legacy static images (shared assets)
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 8, React Router v7, Vanilla CSS |
| **Backend** | Node.js, Express 5 |
| **Database** | MongoDB (Mongoose 9) |
| **Authentication** | JWT (jsonwebtoken) + bcryptjs |
| **Image Hosting** | Cloudinary (via multer-storage-cloudinary) |
| **Fonts** | Google Fonts (Inter, Oleo Script Swash Caps) |
| **Icons** | FontAwesome 6 |

---

## 📡 API Reference

All endpoints are prefixed with `http://localhost:5000/api`

### Authentication (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | ❌ | Register a new user (customer or vendor) |
| `POST` | `/auth/login` | ❌ | Login and receive JWT token |

**Register Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "customer"
}
```

**Login Body:**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Login Response:**
```json
{
  "token": "eyJhbGciOi...",
  "user": { "id": "...", "name": "John Doe", "email": "john@example.com", "role": "customer" }
}
```

### Vendor Services (`/api/vendor`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/vendor/products` | ❌ | List all services (public marketplace) |
| `GET` | `/vendor/my-products` | 🔐 Vendor | Get current vendor's own listings |
| `POST` | `/vendor/products` | 🔐 Vendor | Create a new service (multipart/form-data with images) |
| `DELETE` | `/vendor/products/:id` | 🔐 Vendor | Delete a service (ownership verified) |

**Create Service (FormData):**
- `name` (string, required)
- `price` (number, required)
- `description` (string)
- `category` (string: photography, decoration, catering, planning, venues)
- `location` (string: Hyderabad or Warangal)
- `contact` (string)
- `images` (file[], max 5 images)

### Orders (`/api/order`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/order` | 🔐 User | Place a booking order |
| `GET` | `/order` | 🔐 User | Get current user's booking history |

**Create Order Body:**
```json
{
  "vendorId": "vendor_object_id",
  "products": [
    { "productId": "product_id", "name": "Wedding Photography", "quantity": 1, "price": 15000 }
  ]
}
```

### Utility

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/test` | Health check |
| `GET` | `/api/routes` | List all registered API routes |

---

## 🚀 How to Run Locally

### Prerequisites
- **Node.js** (v18+)
- **MongoDB** running locally on `mongodb://127.0.0.1:27017`
- **Cloudinary account** (free tier works) — [Sign up here](https://cloudinary.com)

### 1. Clone & Setup Environment

Create a `.env` file in the `backend/` directory:
```env
MONGO_URI=mongodb://127.0.0.1:27017/vendorApp
JWT_SECRET=your_super_secret_key
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. Start the Backend
```bash
cd backend
npm install
node server.js
```
✅ Server starts on `http://localhost:5000`

### 3. Start the Frontend
Open a **new terminal**:
```bash
cd frontend
npm install
npm run dev
```
✅ Vite dev server starts on `http://localhost:5173`

### 4. Test the App
1. Open `http://localhost:5173` in your browser
2. Click **Login** → then **Create one for free** to register
3. Register as a **Customer** to browse and book services
4. Register as a **Vendor** to access the Vendor Dashboard and add services

---

## 🔐 Security Features

- **Password Hashing** — All passwords are hashed with `bcryptjs` (10 salt rounds) before storage
- **JWT Authentication** — Stateless auth with 1-day token expiry
- **Role-Based Access Control** — Vendor-only routes are guarded by `isVendor` middleware
- **Ownership Verification** — Vendors can only delete their own products
- **XSS Prevention** — React's JSX auto-escapes all dynamic content
- **Cloudinary Image Storage** — No Base64 blobs in the database; only optimized CDN URLs
- **CORS Enabled** — Cross-origin requests are properly handled

---

## 📱 Frontend Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Home.jsx` | Landing page with carousel, events, live services, blog |
| `/login` | `Login.jsx` | Email/password login with customer/vendor role switcher |
| `/signup` | `Signup.jsx` | New account registration form |
| `/profile` | `Profile.jsx` | User profile card with stats (redirects to login if unauthenticated) |
| `/vendor-dashboard` | `VendorDashboard.jsx` | Service management panel (vendor-only) |
| `/*` | `Home.jsx` | Catch-all fallback to homepage |

---

## 🎨 Design System

- **Primary Color:** `#ffcc4d` (Mustard Gold)
- **Font - Logo:** Oleo Script Swash Caps (Serif Cursive)
- **Font - Body:** Inter (Sans-Serif)
- **Icons:** FontAwesome 6
- **Border Radius:** 8px (standard), 12px (large), 999px (pills)
- **Responsive Breakpoints:** 768px (mobile), 900px (tablet)
- **Animations:** Slide-down dropdown, card hover lift, carousel crossfade, blog image zoom

---

## 📊 Database Schemas

### User
| Field | Type | Constraints |
|-------|------|-------------|
| `name` | String | Required |
| `email` | String | Required, Unique |
| `password` | String | Required (hashed) |
| `role` | String | Enum: `vendor`, `customer` |

### Product (Service)
| Field | Type | Constraints |
|-------|------|-------------|
| `name` | String | Required, Trimmed |
| `price` | Number | Required, Min: 0 |
| `description` | String | Default: "" |
| `category` | String | Default: "Uncategorized" |
| `location` | String | Enum: `Hyderabad`, `Warangal` |
| `contact` | String | Default: "" |
| `images` | [String] | Cloudinary URLs, Default: [] |
| `vendorId` | ObjectId → User | Required |
| `createdAt` | Date | Auto (timestamps) |

### Order
| Field | Type | Constraints |
|-------|------|-------------|
| `customerId` | ObjectId → User | Required |
| `vendorId` | ObjectId → User | Required |
| `products` | Array | productId, name, quantity (min 1), price |
| `createdAt` | Date | Auto (timestamps) |

---

## 🧪 Testing the API (cURL Examples)

### Register a Customer
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"123456","role":"customer"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

### Get All Services (Public)
```bash
curl http://localhost:5000/api/vendor/products
```

### Book a Service (Authenticated)
```bash
curl -X POST http://localhost:5000/api/order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"vendorId":"VENDOR_ID","products":[{"productId":"PRODUCT_ID","name":"Service","quantity":1,"price":5000}]}'
```

---

## 📄 License

This project is for educational and portfolio purposes.

---

> **Built with ❤️ for Event Planners** — EventXpress Technologies © 2026
