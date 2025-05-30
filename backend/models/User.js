const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },

    email: {
      type: String,
      unique: true,
      sparse: true,
    },

    mobileNumber: {
      type: String,
      unique: true,
      sparse: true,
      match: [/^[0-9]{10}$/, "Mobile number must be a 10-digit number"], // Add validation
    },

    password: {
      type: String,
    },

    facebookId: {
      type: String,
      unique: true,
      sparse: true,
    },

    profilePic: { type: String },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    avatar: String,

    provider: {
      type: String,
      default: "local",
      enum: ["local", "facebook", "google"],
    },

    role: {
      type: String,
      default: "user",
      enum: ["user", "admin", "vendor", "super-admin"],
    },

    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],

    otp: { type: String },
    otpExpiresAt: { type: Date },
  },
  { timestamps: true }
);

// Automatically hash password before saving (only if modified and exists)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Password comparison method for login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);