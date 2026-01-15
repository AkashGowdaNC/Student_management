require('dotenv').config();

// Allow Render's domain
const allowedOrigins = [
  'https://student-management-3-9165.onrender.com', // Your combined URL
  'https://student-management-4-u0vu.onrender.com', // Your static site
  'http://localhost:3000'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

const express = require('express');
const cors = require('cors');
const path = require('path'); // Added for serving React

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors(corsOptions)); // Use cors with options
app.use(express.json());

// Remove MongoDB connection for now
console.log('🚀 Server starting WITHOUT MongoDB...');

// Mock data
const students = [
  {
    usn: "1RV20CS001",
    name: "John Smith",
    email: "john.smith@college.edu",
    phone: "9876543210",
    course: "Computer Science",
    semester: 5,
    address: "Bangalore",
    dob: "2002-05-15",
    fatherName: "Robert Smith",
    motherName: "Mary Smith",
    attendance: "85%",
    cgpa: "8.9",
    feesPaid: true
  },
  {
    usn: "1RV20CS002",
    name: "Emma Johnson",
    email: "emma.j@college.edu",
    phone: "8765432109",
    course: "Computer Science",
    semester: 5,
    address: "Bangalore",
    dob: "2002-08-22",
    fatherName: "David Johnson",
    motherName: "Sarah Johnson",
    attendance: "92%",
    cgpa: "9.2",
    feesPaid: true
  }
];

// API Routes
app.get('/', (req, res) => {
  res.json({
    message: '✅ Student Management System API',
    status: 'Running successfully',
    database: 'Using mock data (no MongoDB)',
    endpoints: ['/api/students', '/api/students/search/:usn', '/api/auth/login', '/api/health']
  });
});

// Get all students
app.get('/api/students', (req, res) => {
  res.json({ success: true, count: students.length, students });
});

// Search student by USN
app.get('/api/students/search/:usn', (req, res) => {
  const usn = req.params.usn.toUpperCase();
  const student = students.find(s => s.usn === usn);
  
  if (student) {
    res.json({ success: true, student });
  } else {
    res.status(404).json({ 
      success: false, 
      message: `Student with USN ${usn} not found`,
      suggestion: 'Try: 1RV20CS001 or 1RV20CS002'
    });
  }
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { username, password, role } = req.body;
  
  const users = {
    admin: { 
      username: 'admin', 
      password: 'admin123', 
      role: 'admin', 
      name: 'Admin User' 
    },
    teacher: { 
      username: 'teacher', 
      password: 'teacher123', 
      role: 'teacher', 
      name: 'Teacher User' 
    },
    student: { 
      username: 'student', 
      password: 'student123', 
      role: 'student', 
      name: 'Student User', 
      usn: '1RV20CS001' 
    }
  };
  
  const user = users[username];
  
  if (user && user.password === password && user.role === role) {
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        username: user.username,
        role: user.role,
        name: user.name,
        usn: user.usn,
        token: 'demo-token-' + Date.now()
      }
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid credentials',
      demoAccounts: {
        admin: 'admin/admin123',
        teacher: 'teacher/teacher123', 
        student: 'student/student123'
      }
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: '✅ healthy', 
    timestamp: new Date().toISOString(),
    port: PORT,
    version: '1.0.0',
    database: 'mock data (no MongoDB needed)'
  });
});

// ✅ Serve React frontend from build folder
// This MUST come before the 404 handler

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../frontend/build')));

// All other GET requests return React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// 404 handler - This will only be reached if no API routes match
// and if the React build folder doesn't exist
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    availableRoutes: [
      'GET /',
      'GET /api/health',
      'GET /api/students',
      'GET /api/students/search/:usn',
      'POST /api/auth/login'
    ],
    note: 'React frontend build folder might be missing'
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Access at: http://localhost:${PORT}`);
  console.log(`📊 API Status: http://localhost:${PORT}/api/health`);
  console.log(`🎓 Demo USN: 1RV20CS001`);
  console.log(`👤 Demo login: admin/admin123`);
  console.log(`🚀 React frontend will be served from: ${path.join(__dirname, '../frontend/build')}`);
});