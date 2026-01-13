const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    usn: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true,
        enum: ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical']
    },
    semester: {
        type: Number,
        required: true,
        min: 1,
        max: 8
    },
    address: String,
    dob: String,
    fatherName: String,
    motherName: String,
    attendance: {
        type: String,
        default: "0%"
    },
    cgpa: {
        type: String,
        default: "0.0"
    },
    feesPaid: {
        type: Boolean,
        default: false
    },
    assignedTeacher: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Student', studentSchema);