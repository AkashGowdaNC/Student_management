import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = 'http://localhost:5000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
        role
      });

      onLogin(response.data);
      
      // Redirect based on role
      switch(role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'teacher':
          navigate('/teacher');
          break;
        case 'student':
          navigate('/student');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoUsername, demoPassword, demoRole) => {
    setUsername(demoUsername);
    setPassword(demoPassword);
    setRole(demoRole);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1><i className="fas fa-graduation-cap"></i> Student Management System</h1>
          <p>Please login to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="role"><i className="fas fa-user-tag"></i> Select Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="form-control"
            >
              <option value="admin">Administrator</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="username"><i className="fas fa-user"></i> Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password"><i className="fas fa-lock"></i> Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="form-control"
              required
            />
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Logging in...' : <><i className="fas fa-sign-in-alt"></i> Login</>}
          </button>

          <div className="demo-accounts">
            <h3><i className="fas fa-user-secret"></i> Demo Accounts</h3>
            <div className="demo-account" onClick={() => fillDemoAccount('admin', 'admin123', 'admin')}>
              <strong>Admin:</strong> admin / admin123
            </div>
            <div className="demo-account" onClick={() => fillDemoAccount('teacher', 'teacher123', 'teacher')}>
              <strong>Teacher:</strong> teacher / teacher123
            </div>
            <div className="demo-account" onClick={() => fillDemoAccount('student', 'student123', 'student')}>
              <strong>Student:</strong> student / student123
            </div>
          </div>

          <div className="login-footer">
            <a href="/" className="btn btn-link">
              <i className="fas fa-search"></i> Public Student Search
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;