const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Assuming you have a User model

exports.protect = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      (req.headers.authorization && req.headers.authorization.startsWith("Bearer "))
        ? req.headers.authorization.split(" ")[1]
        : null;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Add this function (or adjust its logic based on your exact needs)
exports.adminOnly = (req, res, next) => {
  // Assuming protect middleware has already run and populated req.user
  if (req.user && req.user.role === 'admin') { // Check if the user's role is 'admin'
    next(); // User is an admin, proceed to the next middleware/controller
  } else {
    // User is not an admin, send a 403 Forbidden response
    res.status(403).json({ message: "Not authorized to access this resource. Admin role required." });
  }
};

// If you also use superAdminOnly in other routes, define and export it similarly
exports.superAdminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'super-admin') {
    next();
  } else {
    res.status(403).json({ message: "Not authorized to access this resource. Super Admin role required." });
  }
};