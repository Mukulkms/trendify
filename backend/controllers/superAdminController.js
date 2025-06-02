const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Keep this for other parts, though not needed for registerUser directly
const jwt = require('jsonwebtoken');

// Register Vendor/Admin
exports.registerUser = async (req, res) => {
  try {
    const { fullname, email, password, mobileNumber, role } = req.body;

    if (!['vendor', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    // FIX: Remove manual hashing here. Pass the plain password to the User constructor.
    // The User model's pre('save') hook will handle hashing.
    // const hashedPassword = await bcrypt.hash(password, 10); // <--- DELETE THIS LINE

    const user = new User({
      fullname,
      email,
      password: password, // <--- Pass the plain (unhashed) password here
      mobileNumber,
      role,
      isVerified: false,
    });

    await user.save(); // This save operation will trigger the pre('save') hook in your User model
    res.status(201).json({ message: 'Registration request sent for approval.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Login (email + password) - No changes needed here, as it uses bcrypt.compare correctly
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    console.log('💡 User found:', user.email);
    console.log('🔑 Entered password:', password);
    console.log('🔐 Hashed password from DB:', user.password);

    // Skip approval check for super-admin
    if ((user.role === 'vendor' || user.role === 'admin') && !user.isVerified) {
      return res.status(403).json({ message: 'Account pending approval' });
    }

    // This comparison will now work correctly because the stored password is only hashed once
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('✅ Password match:', isMatch);

    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        fullname: user.fullname,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    console.error('❌ Server error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Get users pending approval - No changes needed
exports.getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({
      isVerified: false,
      role: { $in: ['vendor', 'admin'] },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch pending users', error: err.message });
  }
};

// Approve user - No changes needed
exports.approveUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndUpdate(userId, { isVerified: true });
    res.json({ message: 'User approved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to approve user', error: err.message });
  }
};

// Reject user - No changes needed
exports.rejectUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.json({ message: 'User rejected and deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to reject user', error: err.message });
  }
};