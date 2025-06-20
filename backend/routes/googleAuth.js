const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Start Google login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Callback after Google login
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    try {
      const user = req.user;

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          fullname: user.fullname,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      // ✅ Redirect to frontend with token (via query param)
      res.redirect(`http://localhost:3000?token=${token}`);
    } catch (err) {
      console.error("Google login error:", err);
      res.redirect("/"); // fallback
    }
  }
);

module.exports = router;
