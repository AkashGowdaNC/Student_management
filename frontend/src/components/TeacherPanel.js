import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TeacherPanel.css';

const TeacherPanel = ({ user, onLogout }) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [attendance, setAttendance] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSemester, setFilterSemester] = useState('all');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // ✅ FIXED: Changed to Render URL
  const API_URL = 'https://student-management-3-9165.onrender.com/api';
  // ✅ REMOVED: Token not needed for mock backend
  // const token = localStorage.getItem('token');

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudentsList();
  }, [students, searchTerm, filterSemester]);

  const fetchStudents = async () => {
    try {
      // ✅ FIXED: Removed authorization header
      const response = await axios.get(`${API_URL}/students`);
      console.log('Teacher students response:', response.data);
      
      if (response.data.success) {
        setStudents(response.data.students || []);
      } else {
        setStudents([]);
        showError('No students data found');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      showError('Cannot connect to server. Using demo data.');
      // Fallback to demo data
      setStudents([
        {
          _id: '1',
          usn: '1RV20CS001',
          name: 'John Smith',
          course: 'Computer Science',
          semester: 5,
          attendance: '85%',
          cgpa: '8.9',
          email: 'john.smith@college.edu',
          phone: '9876543210',
          address: 'Bangalore',
          dob: '2002-05-15',
          fatherName: 'Robert Smith',
          motherName: 'Mary Smith',
          feesPaid: true
        },
        {
          _id: '2',
          usn: '1RV20CS002',
          name: 'Emma Johnson',
          course: 'Computer Science',
          semester: 5,
          attendance: '92%',
          cgpa: '9.2',
          email: 'emma.j@college.edu',
          phone: '8765432109',
          address: 'Bangalore',
          dob: '2002-08-22',
          fatherName: 'David Johnson',
          motherName: 'Sarah Johnson',
          feesPaid: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filterStudentsList = () => {
    let filtered = students;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.usn.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by semester
    if (filterSemester !== 'all') {
      filtered = filtered.filter(student => 
        student.semester.toString() === filterSemester
      );
    }

    setFilteredStudents(filtered);
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 4000);
  };

  const handleUpdateAttendance = async (studentId) => {
    if (!attendance || isNaN(attendance) || attendance < 0 || attendance > 100) {
      showError('Please enter valid attendance (0-100)');
      return;
    }

    try {
      // ✅ NOTE: Your backend doesn't have this endpoint yet
      // For now, update locally
      const updatedStudents = students.map(student => {
        if (student._id === studentId || student.usn === studentId) {
          return { ...student, attendance: attendance + '%' };
        }
        return student;
      });
      
      setStudents(updatedStudents);
      showSuccess('Attendance updated locally!');
      setAttendance('');
      setSelectedStudent(null);
    } catch (error) {
      showError('Update endpoint not implemented yet');
    }
  };

  const handleUpdateGrades = async (studentId) => {
    if (!cgpa || isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
      showError('Please enter valid CGPA (0-10)');
      return;
    }

    try {
      // ✅ NOTE: Your backend doesn't have this endpoint yet
      // For now, update locally
      const updatedStudents = students.map(student => {
        if (student._id === studentId || student.usn === studentId) {
          return { ...student, cgpa: cgpa.toString() };
        }
        return student;
      });
      
      setStudents(updatedStudents);
      showSuccess('Grades updated locally!');
      setCgpa('');
      setSelectedStudent(null);
    } catch (error) {
      showError('Update endpoint not implemented yet');
    }
  };

  return (
    <div className="teacher-panel">
      <header className="teacher-header">
        <div>
          <h1>👨‍🏫 Teacher Dashboard</h1>
          <p className="user-info">Welcome, {user?.name || 'Teacher'}</p>
          <p className="api-info">
            <small>🌐 Connected to: {API_URL}</small>
          </p>
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

      <main className="teacher-content">
        {successMessage && (
          <div className="success-message">
            <i className="fas fa-check-circle"></i> {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i> {errorMessage}
          </div>
        )}

        {/* Stats Section */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-users"></i>
            </div>
            <h3>Total Students</h3>
            <p>{students.length}</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-graduation-cap"></i>
            </div>
            <h3>Average CGPA</h3>
            <p>
              {students.length > 0
                ? (students.reduce((sum, s) => sum + parseFloat(s.cgpa || 0), 0) / students.length).toFixed(2)
                : '0.00'
              }
            </p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-filter"></i>
            </div>
            <h3>Filtered Results</h3>
            <p>{filteredStudents.length}</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <h3>Avg Attendance</h3>
            <p>
              {students.length > 0
                ? (students.reduce((sum, s) => sum + parseFloat(s.attendance || 0), 0) / students.length).toFixed(1) + '%'
                : '0%'
              }
            </p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="section">
          <h2><i className="fas fa-search"></i> Search & Filter</h2>
          <div className="form-row">
            <div className="form-group">
              <label><i className="fas fa-user"></i> Search by Name or USN</label>
              <input
                type="text"
                placeholder="Enter student name or USN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label><i className="fas fa-layer-group"></i> Filter by Semester</label>
              <select
                value={filterSemester}
                onChange={(e) => setFilterSemester(e.target.value)}
              >
                <option value="all">All Semesters</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
                <option value="3">Semester 3</option>
                <option value="4">Semester 4</option>
                <option value="5">Semester 5</option>
                <option value="6">Semester 6</option>
                <option value="7">Semester 7</option>
                <option value="8">Semester 8</option>
              </select>
            </div>
            <div className="form-group">
              <button onClick={fetchStudents} className="btn btn-secondary">
                <i className="fas fa-sync"></i> Refresh Data
              </button>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="section">
          <div className="section-header">
            <h2><i className="fas fa-users"></i> Students List ({filteredStudents.length})</h2>
            <div className="section-actions">
              {loading && <span className="loading-text">Loading...</span>}
            </div>
          </div>
          <div className="table-container">
            {loading ? (
              <div className="loading">
                <i className="fas fa-spinner fa-spin"></i> Loading students...
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="no-data">
                <i className="fas fa-user-slash"></i>
                <p>No students found matching your criteria</p>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>USN</th>
                    <th>Name</th>
                    <th>Course</th>
                    <th>Sem</th>
                    <th>Attendance</th>
                    <th>CGPA</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map(student => (
                    <tr key={student._id || student.usn}>
                      <td><span className="usn-badge">{student.usn}</span></td>
                      <td>{student.name}</td>
                      <td>{student.course}</td>
                      <td><span className="sem-badge">S{student.semester}</span></td>
                      <td>
                        <span className={`attendance ${parseFloat(student.attendance) >= 75 ? 'good' : 'low'}`}>
                          {student.attendance}
                        </span>
                      </td>
                      <td>
                        <span className={`cgpa ${parseFloat(student.cgpa) >= 8.0 ? 'good' : 'average'}`}>
                          {student.cgpa}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => setSelectedStudent({ ...student, action: 'attendance' })}
                            className="btn btn-sm btn-primary"
                          >
                            <i className="fas fa-clipboard-check"></i> Attendance
                          </button>
                          <button
                            onClick={() => setSelectedStudent({ ...student, action: 'grades' })}
                            className="btn btn-sm btn-success"
                          >
                            <i className="fas fa-graduation-cap"></i> Grades
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Update Section */}
        {selectedStudent && (
          <div className="section">
            <h2>
              <i className="fas fa-edit"></i> Update {selectedStudent.name}
              <button
                onClick={() => {
                  setSelectedStudent(null);
                  setAttendance('');
                  setCgpa('');
                }}
                className="btn btn-sm btn-danger float-right"
              >
                <i className="fas fa-times"></i> Cancel
              </button>
            </h2>

            {selectedStudent.action === 'attendance' ? (
              <div className="update-form">
                <div className="form-group">
                  <label><i className="fas fa-chart-bar"></i> Current Attendance: 
                    <span className="current-value"> {selectedStudent.attendance}</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={attendance}
                    onChange={(e) => setAttendance(e.target.value)}
                    placeholder="Enter new attendance (0-100)"
                    className="form-control"
                  />
                  <button
                    onClick={() => handleUpdateAttendance(selectedStudent._id || selectedStudent.usn)}
                    className="btn btn-primary btn-block"
                  >
                    <i className="fas fa-save"></i> Update Attendance
                  </button>
                </div>
              </div>
            ) : (
              <div className="update-form">
                <div className="form-group">
                  <label><i className="fas fa-star"></i> Current CGPA: 
                    <span className="current-value"> {selectedStudent.cgpa}</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.01"
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                    placeholder="Enter new CGPA (0-10)"
                    className="form-control"
                  />
                  <button
                    onClick={() => handleUpdateGrades(selectedStudent._id || selectedStudent.usn)}
                    className="btn btn-primary btn-block"
                  >
                    <i className="fas fa-save"></i> Update Grades
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default TeacherPanel;