const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

// Sample users data (in production, use database)
const initializeUsers = async () => {
    const users = [
        {
            username: 'admin',
            password: 'admin123',
            role: 'admin',
            name: 'System Administrator',
            email: 'admin@college.edu'
        },
        {
            username: 'teacher',
            password: 'teacher123',
            role: 'teacher',
            name: 'Dr. Sarah Johnson',
            email: 'sarah.j@college.edu',
            department: 'Computer Science',
            experience: '10 years'
        },
        {
            username: 'student',
            password: 'student123',
            role: 'student',
            name: 'John Smith',
            email: 'john.smith@college.edu',
            usn: '1RV20CS001',
            course: 'Computer Science',
            semester: 5
        }
    ];

    for (const user of users) {
        const existingUser = await User.findOne({ username: user.username });
        if (!existingUser) {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            await User.create({
                ...user,
                password: hashedPassword
            });
        }
    }
};

// Initialize users on startup
initializeUsers();

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Find user
        const user = await User.findOne({ username, role });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign(
            { 
                userId: user._id, 
                username: user.username, 
                role: user.role,
                name: user.name 
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // Return user info (without password) and token
        const userResponse = {
            id: user._id,
            username: user.username,
            role: user.role,
            name: user.name,
            email: user.email,
            department: user.department,
            usn: user.usn,
            course: user.course,
            semester: user.semester
        };

        res.json({
            message: 'Login successful',
            token,
            user: userResponse
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Register Route (for demo)
router.post('/register', async (req, res) => {
    try {
        const { username, password, role, name, email } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            username,
            password: hashedPassword,
            role,
            name,
            email
        });

        res.json({
            message: 'User registered successfully',
            userId: user._id
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get current user
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

module.exports = router;