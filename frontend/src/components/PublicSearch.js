import React, { useState } from 'react';
import axios from 'axios';
import './PublicSearch.css';

const PublicSearch = () => {
  const [usn, setUsn] = useState('');
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ FIXED: Changed to Render URL
  const API_URL = 'https://student-management-3-9165.onrender.com/api';

  const searchStudent = async () => {
    if (!usn.trim()) {
      setError('Please enter a USN');
      return;
    }

    setLoading(true);
    setError('');
    setStudent(null);

    try {
      const response = await axios.get(`${API_URL}/students/search/${usn}`);
      console.log('Search response:', response.data);
      
      if (response.data.success) {
        setStudent(response.data.student);
      } else {
        setError(response.data.message || 'Student not found');
      }
    } catch (err) {
      console.error('Search error:', err);
      // Handle different types of errors
      if (err.response) {
        // Server responded with error status
        setError(err.response.data?.message || `Error: ${err.response.status}`);
      } else if (err.request) {
        // No response received
        setError('Cannot connect to server. Please check your internet connection.');
      } else {
        // Other errors
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const quickSearch = (sampleUsn) => {
    setUsn(sampleUsn);
    // Use setTimeout to ensure state is updated before search
    setTimeout(() => {
      searchStudent();
    }, 10);
  };

  return (
    <div className="public-search-container">
      <header className="public-header">
        <h1><i className="fas fa-graduation-cap"></i> Student Management System</h1>
        <p>Search any student by University Serial Number (USN)</p>
        <div className="api-info">
          <small>🌐 API: {API_URL}</small>
        </div>
        <a href="/login" className="admin-link">
          <i className="fas fa-lock"></i> Admin/Teacher/Student Login
        </a>
      </header>

      <main className="search-main">
        <div className="search-section">
          <h2><i className="fas fa-search"></i> Search Student by USN</h2>
          
          <div className="search-box">
            <input
              type="text"
              value={usn}
              onChange={(e) => setUsn(e.target.value)}
              placeholder="Enter USN (e.g., 1RV20CS001)"
              onKeyPress={(e) => e.key === 'Enter' && searchStudent()}
            />
            <button onClick={searchStudent} disabled={loading}>
              <i className="fas fa-search"></i> {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          <div className="sample-usn">
            <p><i className="fas fa-lightbulb"></i> Try these sample USNs:</p>
            <div className="usn-tags">
              {['1RV20CS001', '1RV20CS002'].map((sample) => (
                <span 
                  key={sample} 
                  className="usn-tag" 
                  onClick={() => quickSearch(sample)}
                  title={`Click to search ${sample}`}
                >
                  {sample}
                </span>
              ))}
            </div>
            <p className="demo-hint">
              <small>Demo USNs: 1RV20CS001 (John Smith), 1RV20CS002 (Emma Johnson)</small>
            </p>
          </div>

          {error && !student && (
            <div className="error-hint">
              <i className="fas fa-info-circle"></i>
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="student-details-section">
          {loading ? (
            <div className="loading">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Searching for student {usn}...</p>
            </div>
          ) : error && !student ? (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              <h3>Student Not Found</h3>
              <p>{error}</p>
              <div className="suggestions">
                <p>Try one of these:</p>
                <ul>
                  <li>Make sure USN is correct: <strong>1RV20CS001</strong></li>
                  <li>Check your internet connection</li>
                  <li>Try the demo USN buttons above</li>
                </ul>
              </div>
            </div>
          ) : student ? (
            <div className="student-card">
              <div className="student-header">
                <div className="student-avatar">
                  {student.name?.charAt(0) || 'S'}
                </div>
                <div className="student-info">
                  <h3>{student.name || 'Unknown Student'}</h3>
                  <div className="usn">{student.usn}</div>
                  <div className="course-badge">
                    {student.course || 'N/A'} - Semester {student.semester || 'N/A'}
                  </div>
                </div>
              </div>

              <div className="student-details-grid">
                <div className="detail-item">
                  <label><i className="fas fa-envelope"></i> Email</label>
                  <span>{student.email || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label><i className="fas fa-phone"></i> Phone</label>
                  <span>{student.phone || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label><i className="fas fa-home"></i> Address</label>
                  <span>{student.address || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label><i className="fas fa-birthday-cake"></i> Date of Birth</label>
                  <span>{student.dob || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label><i className="fas fa-male"></i> Father's Name</label>
                  <span>{student.fatherName || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label><i className="fas fa-female"></i> Mother's Name</label>
                  <span>{student.motherName || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label><i className="fas fa-clipboard-check"></i> Attendance</label>
                  <span className={`attendance ${parseFloat(student.attendance) >= 75 ? 'good' : 'low'}`}>
                    {student.attendance || 'N/A'}
                  </span>
                </div>
                <div className="detail-item">
                  <label><i className="fas fa-graduation-cap"></i> CGPA</label>
                  <span className={`cgpa ${parseFloat(student.cgpa) >= 8.0 ? 'good' : 'average'}`}>
                    {student.cgpa || 'N/A'}
                  </span>
                </div>
                <div className="detail-item">
                  <label><i className="fas fa-money-check-alt"></i> Fees Status</label>
                  <span className={`fees ${student.feesPaid ? 'paid' : 'pending'}`}>
                    {student.feesPaid ? 'Paid' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-student">
              <i className="fas fa-user-graduate"></i>
              <h3>Welcome to Student Portal</h3>
              <p>Enter a USN to view complete student details</p>
              <div className="instructions">
                <p><strong>How to search:</strong></p>
                <ol>
                  <li>Enter USN in the search box above</li>
                  <li>Click "Search" or press Enter</li>
                  <li>Or click demo USN buttons for quick results</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PublicSearch;