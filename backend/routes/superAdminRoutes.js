
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  registerUser,
  loginUser,
  getPendingUsers,
  approveUser,
  rejectUser,
} = require('../controllers/superAdminController');

// Registration (Admin/Vendor only) - usually public, no auth needed
router.post('/register', registerUser);

// Login - public
router.post('/login', loginUser);

// Super Admin Routes - protect and restrict to super-admin only
router.get('/pending-users', auth.protect, auth.superAdminOnly, getPendingUsers);

router.put('/approve/:userId', auth.protect, auth.superAdminOnly, approveUser);

router.delete('/reject/:userId', auth.protect, auth.superAdminOnly, rejectUser);

module.exports = router;
