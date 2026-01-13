const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB (using MongoDB Atlas or local)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/student_management', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

// Import Routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

// Sample data endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access at: http://localhost:${PORT}`);
});