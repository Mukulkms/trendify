const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const path = require('path');

require("./config/passport");
dotenv.config();

const app = express();

console.log("MONGO_URI:", process.env.MONGO_URI);

// ✅ Fix: Increased request body size limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use('/images', express.static(path.join(__dirname, 'public', 'assets', 'images')));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_fallback_secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// Routes
app.get("/", (req, res) => {
  res.send("Trendify API is running...");
});

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// API Routes
const adminVendorAuthRoutes = require('./routes/adminVendorAuth');
app.use('/api/admin-vendor-auth', adminVendorAuthRoutes);

const superAdminRoutes = require('./routes/superAdminRoutes');
app.use('/api/superadmin', superAdminRoutes);

const superAdminAuthModule = require('./routes/superAdminAuthRoutes');
app.use('/api/superadmin-auth', superAdminAuthModule.router);

const productRoutes = require("./routes/productRoutes");
app.use("/api/products",productRoutes)

const paymentRoutes = require("./routes/paymentRoutes");
app.use("/api/payment", paymentRoutes);

const addressRoutes = require("./routes/addressRoutes");
app.use("/api/addresses", addressRoutes);

const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const facebookAuthRoutes = require("./routes/facebookAuth");
app.use("/auth/facebook", facebookAuthRoutes);

const googleAuthRoutes = require("./routes/googleAuth");
app.use("/api/auth/google", googleAuthRoutes);

// Catch-all for 404 errors
app.use((req, res, next) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
