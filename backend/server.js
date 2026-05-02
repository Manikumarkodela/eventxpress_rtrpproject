// server.js

require("dotenv").config(); // MUST be first

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
console.log(`[BOOT] API file: ${__filename}`);
console.log(`[BOOT] CWD: ${process.cwd()}`);

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl}`);
  next();
});

/* ================= DB CONNECTION ================= */
connectDB(); // assume it handles errors internally

/* ================= ROUTES ================= */

// Keep API consistent
app.use("/api/auth", authRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/order", orderRoutes);

/* ================= TEST ROUTE ================= */
app.get("/api/test", (req, res) => {
  console.log("[HIT] /api/test");
  res.json({ message: "API working" });
});

app.get("/api/routes", (req, res) => {
  res.json({
    auth: [
      "POST /api/auth/register",
      "POST /api/auth/login"
    ],
    vendors: [
      "GET /api/vendor/products",
      "GET /api/vendor/my-products",
      "POST /api/vendor/products",
      "POST /api/vendor/product"
    ],
    orders: [
      "POST /api/order",
      "POST /api/orders"
    ],
    test: [
      "GET /api/test",
      "GET /api/routes"
    ]
  });
});

app.use((req, res) => {
  console.log(`[404] ${req.method} ${req.originalUrl}`);
  res.status(404).json({ msg: `Route not found: ${req.method} ${req.originalUrl}` });
});

/* ================= ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(500).json({ msg: "Something went wrong" });
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
