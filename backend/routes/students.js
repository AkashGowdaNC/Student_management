const express = require('express');
const Student = require('../models/student');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Initialize sample students
const initializeStudents = async () => {
    const sampleStudents = [
        {
            usn: "1RV20CS001",
            name: "John Smith",
            email: "john.smith@rvce.edu.in",
            phone: "9876543210",
            course: "Computer Science",
            semester: 5,
            address: "123 MG Road, Bangalore",
            dob: "2002-05-15",
            fatherName: "Robert Smith",
            motherName: "Mary Smith",
            attendance: "85%",
            cgpa: "8.9",
            feesPaid: true,
            assignedTeacher: "teacher"
        },
        {
            usn: "1RV20CS002",
            name: "Emma Johnson",
            email: "emma.j@rvce.edu.in",
            phone: "8765432109",
            course: "Computer Science",
            semester: 5,
            address: "456 Brigade Road, Bangalore",
            dob: "2002-08-22",
            fatherName: "David Johnson",
            motherName: "Sarah Johnson",
            attendance: "92%",
            cgpa: "9.2",
            feesPaid: true,
            assignedTeacher: "teacher"
        },
        {
            usn: "1RV20CS003",
            name: "Michael Brown",
            email: "michael.b@rvce.edu.in",
            phone: "7654321098",
            course: "Electronics",
            semester: 4,
            address: "789 Indiranagar, Bangalore",
            dob: "2003-01-30",
            fatherName: "James Brown",
            motherName: "Lisa Brown",
            attendance: "78%",
            cgpa: "7.8",
            feesPaid: false,
            assignedTeacher: "teacher2"
        }
    ];

    for (const student of sampleStudents) {
        const existingStudent = await Student.findOne({ usn: student.usn });
        if (!existingStudent) {
            await Student.create(student);
        }
    }
};

initializeStudents();

// Get all students (Admin & Teacher)
router.get('/', async (req, res) => {
    try {
        const students = await Student.find().sort({ usn: 1 });
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get student by USN (Public)
router.get('/search/:usn', async (req, res) => {
    try {
        const usn = req.params.usn.toUpperCase();
        const student = await Student.findOne({ usn });

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json(student);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get student by ID
router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Add new student (Admin only)
router.post('/', async (req, res) => {
    try {
        const studentData = req.body;
        // Ensure USN is uppercase
        if (studentData.usn) studentData.usn = studentData.usn.toUpperCase();

        // Check if USN already exists in Students
        const existingStudent = await Student.findOne({ usn: studentData.usn });
        if (existingStudent) {
            return res.status(400).json({ error: 'Student with this USN already exists' });
        }

        // Check if User already exists
        const existingUser = await User.findOne({ username: studentData.usn });
        if (existingUser) {
            return res.status(400).json({ error: 'User account with this USN already exists' });
        }

        // Create Student
        const student = await Student.create(studentData);

        try {
            // Create User account with '123456' as default password
            const hashedPassword = await bcrypt.hash('123456', 10);
            await User.create({
                username: studentData.usn,
                password: hashedPassword,
                role: 'student',
                name: studentData.name,
                email: studentData.email,
                usn: studentData.usn,
                course: studentData.course,
                semester: studentData.semester
            });

            res.status(201).json({
                message: 'Student added successfully. Default password is "123456"',
                student
            });
        } catch (userError) {
            // If user creation fails, delete the student to maintain consistency
            await Student.findByIdAndDelete(student._id);
            throw userError;
        }

    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

// Update student (Admin & Teacher)
router.put('/:id', async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json({
            message: 'Student updated successfully',
            student: updatedStudent
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete student (Admin only)
router.delete('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Delete associated User account
        await User.findOneAndDelete({ username: student.usn });

        // Delete Student
        await Student.findByIdAndDelete(req.params.id);

        res.json({
            message: 'Student and associated user account deleted successfully',
            student
        });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get students by teacher
router.get('/teacher/:teacherId', async (req, res) => {
    try {
        const students = await Student.find({ assignedTeacher: req.params.teacherId });
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update attendance (Teacher only)
router.put('/:id/attendance', async (req, res) => {
    try {
        const { attendance } = req.body;
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { attendance },
            { new: true }
        );

        res.json({
            message: 'Attendance updated',
            student
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update grades (Teacher only)
router.put('/:id/grades', async (req, res) => {
    try {
        const { cgpa } = req.body;
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { cgpa },
            { new: true }
        );

        res.json({
            message: 'Grades updated',
            student
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;