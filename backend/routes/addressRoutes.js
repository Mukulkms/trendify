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
  body('fullAddress').notEmpty().withMessage('Full address is required'),
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
    const addresses = await Address.find({ userId: req.user.id });
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
    const { fullName, mobileNumber, fullAddress, city, state, pincode, country, isDefault } = req.body;

    if (isDefault) {
      await Address.updateMany(
        { userId: req.user.id, isDefault: true },
        { $set: { isDefault: false } }
      );
    }

    const address = new Address({
      userId: req.user.id,
      fullName,
      mobileNumber,
      fullAddress,
      city,
      state,
      pincode,
      country,
      isDefault: isDefault || false,
    });
    const savedAddress = await address.save();
    res.status(201).json(savedAddress);
  } catch (err) {
    res.status(500).json({ message: 'Failed to save address', error: err.message });
  }
});

// Update an existing address
router.put('/:id', protect, addressValidationRules, async (req, res) => {
  console.log(`PUT /api/addresses/${req.params.id} called by user:`, req.user?.id);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  try {
    const address = await Address.findById(req.params.id);
    if (!address) {
      console.log(`Address not found for ID: ${req.params.id}`);
      return res.status(404).json({ message: 'Address not found' });
    }
    if (address.userId.toString() !== req.user.id) {
      console.log(`Unauthorized access attempt by user ${req.user.id} for address ${req.params.id}`);
      return res.status(403).json({ message: 'Unauthorized to update this address' });
    }

    const { fullName, mobileNumber, fullAddress, city, state, pincode, country, isDefault } = req.body;

    if (isDefault) {
      await Address.updateMany(
        { userId: req.user.id, isDefault: true },
        { $set: { isDefault: false } }
      );
    }

    address.fullName = fullName;
    address.mobileNumber = mobileNumber;
    address.fullAddress = fullAddress;
    address.city = city;
    address.state = state;
    address.pincode = pincode;
    address.country = country;
    address.isDefault = isDefault || false;

    const updatedAddress = await address.save();
    res.status(200).json(updatedAddress);
  } catch (err) {
    console.error(`PUT /api/addresses/${req.params.id} error:`, err.message);
    res.status(500).json({ message: 'Failed to update address', error: err.message });
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