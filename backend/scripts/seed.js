const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Keep this import, but it won't be used for hashing here
const User = require('../models/User');
require('dotenv').config();

const seedAdminUser = async () => {
    try {
        await mongoose.connect(process.env.DB_URI || 'mongodb://localhost:27017/Trendify');
        console.log('MongoDB connected for seeding.');

        const defaultAdminEmail = process.env.ADMIN_EMAIL || 'superadmin@trendify.com';
        const defaultAdminPassword = process.env.ADMIN_PASSWORD || '12345678';
        const defaultAdminFullname = 'Super Admin';
        const defaultAdminMobile = '9675354993';

        const existingAdmin = await User.findOne({ email: defaultAdminEmail });
        if (existingAdmin) {
            console.log('Super admin already exists. Exiting seed.');
            await mongoose.disconnect();
            return;
        }

        // FIX: Remove manual hashing here. Pass the plain password to the User constructor.
        // The User model's pre('save') hook will handle hashing.
        // const hashedPassword = await bcrypt.hash(defaultAdminPassword, 10); // <--- DELETE THIS LINE

        const newAdmin = new User({
            fullname: defaultAdminFullname,
            email: defaultAdminEmail,
            password: defaultAdminPassword, // <--- Pass the plain (unhashed) password here
            mobileNumber: defaultAdminMobile,
            role: 'super-admin',
            isVerified: true  // <-- This is correct for an admin
        });

        await newAdmin.save(); // This save operation will trigger the pre('save') hook in your User model
        console.log('Default super admin created successfully!');
        console.log(`Email: ${defaultAdminEmail}`);
        console.log(`Password: ${defaultAdminPassword}`);

    } catch (error) {
        console.error('Error seeding default super admin:', error);
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
            console.log('MongoDB disconnected.');
        }
    }
};

seedAdminUser();