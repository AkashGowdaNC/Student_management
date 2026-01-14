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

  const API_URL = 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudentsList();
  }, [students, searchTerm, filterSemester]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
      showError('Failed to fetch students');
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
      filtered = filtered.filter(student => student.semester === parseInt(filterSemester));
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
      await axios.put(
        `${API_URL}/students/${studentId}/attendance`,
        { attendance: attendance + '%' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showSuccess('Attendance updated successfully!');
      setAttendance('');
      setSelectedStudent(null);
      fetchStudents();
    } catch (error) {
      showError('Error updating attendance');
    }
  };

  const handleUpdateGrades = async (studentId) => {
    if (!cgpa || isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
      showError('Please enter valid CGPA (0-10)');
      return;
    }

    try {
      await axios.put(
        `${API_URL}/students/${studentId}/grades`,
        { cgpa },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showSuccess('Grades updated successfully!');
      setCgpa('');
      setSelectedStudent(null);
      fetchStudents();
    } catch (error) {
      showError('Error updating grades');
    }
  };

  return (
    <div className="teacher-panel">
      <header className="teacher-header">
        <div>
          <h1>Teacher Dashboard</h1>
          <p className="user-info">Welcome, {user?.name} | {user?.department}</p>
        </div>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </header>

      <main className="teacher-content">
        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        {/* Stats Section */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Students</h3>
            <p>{students.length}</p>
          </div>
          <div className="stat-card">
            <h3>Average CGPA</h3>
            <p>
              {students.length > 0
                ? (students.reduce((sum, s) => sum + parseFloat(s.cgpa), 0) / students.length).toFixed(2)
                : '0.00'
              }
            </p>
          </div>
          <div className="stat-card">
            <h3>Filtered Results</h3>
            <p>{filteredStudents.length}</p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="section">
          <h2>Search & Filter</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Search by Name or USN</label>
              <input
                type="text"
                placeholder="Enter student name or USN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Filter by Semester</label>
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
          </div>
        </div>

        {/* Students List */}
        <div className="section">
          <h2>Students List ({filteredStudents.length})</h2>
          <div className="table-container">
            {loading ? (
              <p>Loading students...</p>
            ) : filteredStudents.length === 0 ? (
              <p className="no-data">No students found matching your criteria</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>USN</th>
                    <th>Name</th>
                    <th>Course</th>
                    <th>Semester</th>
                    <th>Attendance</th>
                    <th>CGPA</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map(student => (
                    <tr key={student._id}>
                      <td>{student.usn}</td>
                      <td>{student.name}</td>
                      <td>{student.course}</td>
                      <td>{student.semester}</td>
                      <td>{student.attendance}</td>
                      <td>{student.cgpa}</td>
                      <td>
                        <button
                          onClick={() => setSelectedStudent({ ...student, action: 'attendance' })}
                          className="btn-edit"
                        >
                          Attendance
                        </button>
                        <button
                          onClick={() => setSelectedStudent({ ...student, action: 'grades' })}
                          className="btn-edit"
                        >
                          Grades
                        </button>
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
            <h2>Update {selectedStudent.name}</h2>

            {selectedStudent.action === 'attendance' ? (
              <div className="form-group">
                <label>Current Attendance: {selectedStudent.attendance}</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={attendance}
                  onChange={(e) => setAttendance(e.target.value)}
                  placeholder="Enter new attendance (0-100)"
                />
                <button
                  onClick={() => handleUpdateAttendance(selectedStudent._id)}
                  className="btn btn-primary"
                >
                  Update Attendance
                </button>
                <button
                  onClick={() => {
                    setSelectedStudent(null);
                    setAttendance('');
                  }}
                  className="btn-secondary"
                  style={{ marginLeft: '1rem' }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="form-group">
                <label>Current CGPA: {selectedStudent.cgpa}</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.01"
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  placeholder="Enter new CGPA (0-10)"
                />
                <button
                  onClick={() => handleUpdateGrades(selectedStudent._id)}
                  className="btn btn-primary"
                >
                  Update Grades
                </button>
                <button
                  onClick={() => {
                    setSelectedStudent(null);
                    setCgpa('');
                  }}
                  className="btn-secondary"
                  style={{ marginLeft: '1rem' }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default TeacherPanel;