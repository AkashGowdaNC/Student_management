const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'teacher', 'student']
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    // For teachers
    department: String,
    experience: String,
    // For students
    usn: String,
    course: String,
    semester: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);