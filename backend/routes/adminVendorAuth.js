// routes/adminVendorAuth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/register-admin-vendor', async (req, res) => {
    try {
        const { fullname, email, password, mobileNumber, role } = req.body;

        if (!['admin', 'vendor'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const newUser = new User({
            fullname,
            email,
            password,
            mobileNumber,
            role,
            status: 'pending',
        });

        await newUser.save();
        return res.status(201).json({
            message: 'Registration successful! Awaiting super admin approval.',
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        if (user.role !== 'admin' && user.role !== 'vendor' && user.role !== 'super-admin') {
            return res.status(403).json({ message: 'Unauthorized role' });
        }

        if (user.role !== 'super-admin' && user.status !== 'approved') {
            return res.status(403).json({ message: 'Account not approved by super admin' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Issue JWT token here if needed
        res.status(200).json({
            message: 'Login successful',
            user: {
                _id: user._id,
                email: user.email,
                role: user.role,
                fullname: user.fullname,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
