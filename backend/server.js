const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
require("./config/passport");

dotenv.config();

const app = express();

// Debugging: Check if MONGO_URI is loaded
console.log("MONGO_URI:", process.env.MONGO_URI);

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_fallback_secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

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
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

const paymentRoutes = require("./routes/paymentRoutes");
app.use("/api/payment", paymentRoutes);

const addressRoutes = require("./routes/addressRoutes");
app.use("/api/addresses", addressRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const facebookAuthRoutes = require("./routes/facebookAuth");
app.use("/auth/facebook", facebookAuthRoutes); // Changed path to avoid conflict

const googleAuthRoutes = require("./routes/googleAuth");
app.use("/api/auth/google", googleAuthRoutes); // Changed path to avoid conflict

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