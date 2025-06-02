const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullname: { 
      type: String, 
      required: true,
      trim: true // Add trim to remove whitespace
    },

    email: {
      type: String,
      unique: true,
      sparse: true, // Allows null values to not violate unique constraint
      lowercase: true, // Store emails in lowercase for consistency
      trim: true,
      // Basic email format validation (more robust validation might be in controller)
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },

    mobileNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      // Regex for 10-digit number. Consider international formats if needed.
      match: [/^[0-9]{10}$/, "Mobile number must be a 10-digit number"],
    },

    password: {
      type: String,
      // Password is not required at the schema level because social logins won't have one.
      // Validation for 'local' provider should happen in the controller.
    },

    facebookId: {
      type: String,
      unique: true,
      sparse: true,
    },

    profilePic: { 
      type: String,
      default: 'https://res.cloudinary.com/your_cloud_name/image/upload/v1/your_default_avatar_path.png' // Consider a default avatar
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    // 'avatar' field seems redundant if 'profilePic' is used.
    // If they serve different purposes, clarify. Otherwise, consider removing one.
    // For now, keeping it as it was provided.
    avatar: String, 

    provider: {
      type: String,
      default: "local",
      enum: ["local", "facebook", "google"],
      required: true // Ensure a provider is always specified
    },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },

    isVerified: { 
      type: Boolean, 
      default: false 
    },
    
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin", "vendor", "super-admin"],
      required: true // Role should always be defined
    },

    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],

    otp: { type: String },
    otpExpiresAt: { type: Date },
  },
  { timestamps: true }
);

// --- START OF CRITICAL PASSWORD HASHING LOGIC ---
// Pre-save hook to hash password before saving to the database
userSchema.pre("save", async function (next) {
  // Only hash if:
  // 1. The document is new OR the password field has been modified.
  // 2. The user's provider is 'local' (social logins don't have a password).
  // 3. The password field actually has a value (e.g., not null or empty string).
  if (this.provider === 'local' && this.isModified("password") && this.password) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
      next(); // Proceed to save
    } catch (error) {
      next(new Error('Failed to hash password: ' + error.message)); // Pass error to Mongoose
    }
  } else {
    // If password is not modified, or no password, or not a local provider, just move on
    next();
  }
});
// --- END OF CRITICAL PASSWORD HASHING LOGIC ---

// Password comparison method for login
userSchema.methods.matchPassword = async function (enteredPassword) {
  // Check if the user has a password (local provider) before attempting comparison
  if (!this.password) {
    return false; // User has no password (e.g., social login)
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);