import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import TeacherPanel from './components/TeacherPanel';
import StudentPanel from './components/StudentPanel';
import PublicSearch from './components/PublicSearch';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userData, setUserData] = useState(null);

  // ADD THIS TEST EFFECT
  useEffect(() => {
    console.log('🔍 Testing connection to backend API...');
    
    // Test health endpoint
    fetch('https://student-management-3-9165.onrender.com/api/health')
      .then(response => response.json())
      .then(data => {
        console.log('✅ Backend API is working:', data);
      })
      .catch(error => {
        console.error('❌ Cannot connect to backend API:', error);
        console.log('📝 Make sure the backend URL is correct: https://student-management-3-9165.onrender.com');
      });
      
    // Test students endpoint
    fetch('https://student-management-3-9165.onrender.com/api/students')
      .then(res => res.json())
      .then(data => console.log('📚 Students data available:', data))
      .catch(err => console.error('❌ Cannot fetch students:', err));
  }, []);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const user = localStorage.getItem('user');
    
    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
      setUserData(user ? JSON.parse(user) : null);
    }
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('role', userData.user.role);
    localStorage.setItem('user', JSON.stringify(userData.user));
    setIsAuthenticated(true);
    setUserRole(userData.user.role);
    setUserData(userData.user);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUserRole('');
    setUserData(null);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicSearch />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          
          {/* Protected Routes */}
          <Route 
            path="/admin" 
            element={
              isAuthenticated && userRole === 'admin' ? 
              <AdminPanel user={userData} onLogout={handleLogout} /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/teacher" 
            element={
              isAuthenticated && userRole === 'teacher' ? 
              <TeacherPanel user={userData} onLogout={handleLogout} /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/student" 
            element={
              isAuthenticated && userRole === 'student' ? 
              <StudentPanel user={userData} onLogout={handleLogout} /> : 
              <Navigate to="/login" />
            } 
          />
          
          {/* Redirect to home if no match */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;