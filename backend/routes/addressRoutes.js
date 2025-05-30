const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Address = require('../models/Address');
const { body, validationResult } = require('express-validator');

// Validation middleware for address fields
const addressValidationRules = [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('mobileNumber')
    .notEmpty()
    .withMessage('Mobile number is required')
    .isLength({ min: 10, max: 10 })
    .withMessage('Mobile number must be 10 digits')
    .isNumeric()
    .withMessage('Mobile number must contain only numbers'),
  body('fullAddress').notEmpty().withMessage('Full address is required'), // Changed from street to fullAddress
  body('city').notEmpty().withMessage('City is required'),
  body('state').notEmpty().withMessage('State is required'),
  body('pincode')
    .notEmpty()
    .withMessage('Pincode is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('Pincode must be 6 digits')
    .isNumeric()
    .withMessage('Pincode must contain only numbers'),
  body('country').notEmpty().withMessage('Country is required'),
];

// Get all addresses for the logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user.id }); // Changed user to userId
    res.status(200).json(addresses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch addresses', error: err.message });
  }
});

// Add a new address
router.post('/', protect, addressValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  try {
    const { fullName, mobileNumber, fullAddress, city, state, pincode, country, isDefault } = req.body; // Changed street to fullAddress

    // If setting as default, unset other default addresses
    if (isDefault) {
      await Address.updateMany(
        { userId: req.user.id, isDefault: true }, // Changed user to userId
        { $set: { isDefault: false } }
      );
    }

    const address = new Address({
      userId: req.user.id, // Changed user to userId
      fullName,
      mobileNumber,
      fullAddress, // Changed street to fullAddress
      city,
      state,
      pincode,
      country,
      isDefault: isDefault || false, // Ensure isDefault is set
    });
    const savedAddress = await address.save();
    res.status(201).json(savedAddress);
  } catch (err) {
    res.status(500).json({ message: 'Failed to save address', error: err.message });
  }
});

// Validate pincode
router.post('/validate-pincode', protect, async (req, res) => {
  try {
    const { pincode } = req.body;
    if (!pincode || pincode.length !== 6 || isNaN(pincode)) {
      return res.status(400).json({ message: 'Invalid pincode' });
    }
    res.status(200).json({ estimate: '5-7 Business Days' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to validate pincode', error: err.message });
  }
});

module.exports = router;