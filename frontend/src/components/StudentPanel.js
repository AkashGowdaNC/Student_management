import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentPanel.css';

const StudentPanel = ({ user, onLogout }) => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState([]);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [error, setError] = useState('');

  // ✅ FIXED: Changed to Render URL
  const API_URL = 'https://student-management-3-9165.onrender.com/api';
  // ✅ REMOVED: Token not needed for mock backend
  // const token = localStorage.getItem('token');

  useEffect(() => {
    fetchStudentData();
    fetchMockData();
  }, []);

  const fetchStudentData = async () => {
    try {
      // ✅ FIXED: Removed authorization header, use correct endpoint
      const usn = user?.usn || (user && user.username === 'student' ? '1RV20CS001' : '');
      
      if (!usn) {
        console.error('No USN found for student');
        setError('Student USN not found');
        setLoading(false);
        return;
      }

      console.log('Fetching data for USN:', usn);
      const response = await axios.get(`${API_URL}/students/search/${usn}`);
      
      console.log('Student data response:', response.data);
      
      if (response.data.success && response.data.student) {
        setStudentData(response.data.student);
      } else {
        setError('Student data not found. Using demo data.');
        // Fallback to demo data
        setStudentData({
          usn: usn,
          name: user?.name || 'Demo Student',
          email: 'demo.student@college.edu',
          phone: '9876543210',
          course: 'Computer Science',
          semester: 5,
          address: 'Bangalore',
          dob: '2002-05-15',
          fatherName: 'Demo Father',
          motherName: 'Demo Mother',
          attendance: '85%',
          cgpa: '8.9',
          feesPaid: true
        });
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
      setError('Cannot connect to server. Using demo data.');
      // Fallback to demo data
      setStudentData({
        usn: user?.usn || '1RV20CS001',
        name: user?.name || 'Demo Student',
        email: user?.email || 'demo.student@college.edu',
        phone: '9876543210',
        course: 'Computer Science',
        semester: 5,
        address: 'Bangalore',
        dob: '2002-05-15',
        fatherName: 'Demo Father',
        motherName: 'Demo Mother',
        attendance: '85%',
        cgpa: '8.9',
        feesPaid: true
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMockData = () => {
    // Mock grades data
    const mockGrades = [
      { subject: 'Data Structures', marks: 85, grade: 'A', credits: 4 },
      { subject: 'Algorithms', marks: 78, grade: 'B+', credits: 4 },
      { subject: 'Database Systems', marks: 92, grade: 'A+', credits: 3 },
      { subject: 'Computer Networks', marks: 81, grade: 'A-', credits: 3 },
    ];

    // Mock attendance history
    const mockAttendance = [
      { date: '2024-01-15', subject: 'Data Structures', status: 'Present' },
      { date: '2024-01-16', subject: 'Algorithms', status: 'Absent' },
      { date: '2024-01-17', subject: 'Database Systems', status: 'Present' },
      { date: '2024-01-18', subject: 'Computer Networks', status: 'Present' },
    ];

    setGrades(mockGrades);
    setAttendanceHistory(mockAttendance);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your student data...</p>
        <p className="api-info">Connecting to: {API_URL}</p>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="error-container">
        <h2><i className="fas fa-exclamation-triangle"></i> Student data not found</h2>
        <p>{error}</p>
        <div className="suggestions">
          <p>Possible solutions:</p>
          <ul>
            <li>Make sure you're logged in as a student</li>
            <li>Check if backend API is running</li>
            <li>Try logging out and logging back in</li>
          </ul>
        </div>
        <button onClick={onLogout} className="btn btn-primary">
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    );
  }

  return (
    <div className="student-container">
      <header className="student-header">
        <div className="user-info">
          <div className="user-avatar student">
            {studentData.name?.charAt(0) || 'S'}
          </div>
          <div>
            <h2>Welcome, {studentData.name}</h2>
            <p className="user-role">
              {studentData.course} - Semester {studentData.semester}
            </p>
            <p className="usn-display">{studentData.usn}</p>
            <p className="api-status">
              <small>🌐 Connected to: {API_URL}</small>
            </p>
          </div>
        </div>
        <div className="header-actions">
          <button onClick={() => window.location.href = '/'} className="btn btn-secondary">
            <i className="fas fa-search"></i> Public Search
          </button>
          <button onClick={onLogout} className="btn btn-danger">
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </header>

      {error && (
        <div className="demo-warning">
          <i className="fas fa-info-circle"></i>
          <span>{error}</span>
        </div>
      )}

      <main className="student-main">
        {/* Student Stats */}
        <div className="student-stats">
          <div className="stat-card">
            <div className="stat-icon attendance">
              <i className="fas fa-clipboard-check"></i>
            </div>
            <div className="stat-info">
              <h3>{studentData.attendance || '85%'}</h3>
              <p>Attendance</p>
              <span className={`status ${parseFloat(studentData.attendance) >= 75 ? 'good' : 'warning'}`}>
                {parseFloat(studentData.attendance) >= 75 ? 'Good' : 'Needs Improvement'}
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon cgpa">
              <i className="fas fa-graduation-cap"></i>
            </div>
            <div className="stat-info">
              <h3>{studentData.cgpa || '8.5'}</h3>
              <p>CGPA</p>
              <span className={`status ${parseFloat(studentData.cgpa) >= 8.0 ? 'excellent' : 'good'}`}>
                {parseFloat(studentData.cgpa) >= 8.0 ? 'Excellent' : 'Good'}
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon fees">
              <i className="fas fa-money-check-alt"></i>
            </div>
            <div className="stat-info">
              <h3>{studentData.feesPaid ? 'Paid' : 'Pending'}</h3>
              <p>Fees Status</p>
              <span className={`status ${studentData.feesPaid ? 'paid' : 'pending'}`}>
                {studentData.feesPaid ? 'Cleared' : 'Due'}
              </span>
            </div>
          </div>
        </div>

        <div className="student-grid">
          {/* Personal Information */}
          <div className="student-card">
            <h3><i className="fas fa-user"></i> Personal Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Email</label>
                <p>{studentData.email}</p>
              </div>
              <div className="info-item">
                <label>Phone</label>
                <p>{studentData.phone}</p>
              </div>
              <div className="info-item">
                <label>Date of Birth</label>
                <p>{studentData.dob}</p>
              </div>
              <div className="info-item">
                <label>Address</label>
                <p>{studentData.address}</p>
              </div>
              <div className="info-item">
                <label>Father's Name</label>
                <p>{studentData.fatherName}</p>
              </div>
              <div className="info-item">
                <label>Mother's Name</label>
                <p>{studentData.motherName}</p>
              </div>
            </div>
          </div>

          {/* Grades */}
          <div className="student-card">
            <h3><i className="fas fa-graduation-cap"></i> Grades</h3>
            <div className="grades-table">
              <table>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Marks</th>
                    <th>Grade</th>
                    <th>Credits</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((grade, index) => (
                    <tr key={index}>
                      <td>{grade.subject}</td>
                      <td>{grade.marks}</td>
                      <td><span className="grade-badge">{grade.grade}</span></td>
                      <td>{grade.credits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Attendance History */}
          <div className="student-card">
            <h3><i className="fas fa-history"></i> Attendance History</h3>
            <div className="attendance-table">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Subject</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceHistory.map((record, index) => (
                    <tr key={index}>
                      <td>{record.date}</td>
                      <td>{record.subject}</td>
                      <td>
                        <span className={`status-badge ${record.status === 'Present' ? 'present' : 'absent'}`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fee Details */}
          <div className="student-card">
            <h3><i className="fas fa-money-check-alt"></i> Fee Details</h3>
            <div className="fee-details">
              <div className="fee-item">
                <span className="fee-label">Tuition Fee</span>
                <span className="fee-amount">₹50,000</span>
                <span className={`fee-status ${studentData.feesPaid ? 'paid' : 'pending'}`}>
                  {studentData.feesPaid ? 'Paid' : 'Due: 2024-03-31'}
                </span>
              </div>
              <div className="fee-item">
                <span className="fee-label">Library Fee</span>
                <span className="fee-amount">₹2,000</span>
                <span className={`fee-status ${studentData.feesPaid ? 'paid' : 'pending'}`}>
                  {studentData.feesPaid ? 'Paid' : 'Pending'}
                </span>
              </div>
              <div className="fee-item">
                <span className="fee-label">Exam Fee</span>
                <span className="fee-amount">₹3,000</span>
                <span className={`fee-status ${studentData.feesPaid ? 'paid' : 'pending'}`}>
                  {studentData.feesPaid ? 'Paid' : 'Pending'}
                </span>
              </div>
            </div>

            {!studentData.feesPaid && (
              <div className="payment-options">
                <h4>Make Payment</h4>
                <div className="payment-buttons">
                  <button className="btn btn-success">
                    <i className="fas fa-university"></i> Bank Transfer
                  </button>
                  <button className="btn btn-primary">
                    <i className="fas fa-credit-card"></i> Credit Card
                  </button>
                  <button className="btn btn-secondary">
                    <i className="fas fa-wallet"></i> UPI
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentPanel;