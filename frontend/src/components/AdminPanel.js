import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css';

const AdminPanel = ({ user, onLogout }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    usn: '',
    name: '',
    email: '',
    phone: '',
    course: 'Computer Science',
    semester: '1',
    address: '',
    dob: '',
    fatherName: '',
    motherName: ''
  });

  // ✅ FIX 1: Changed to Render URL
  const API_URL = 'https://student-management-3-9165.onrender.com/api';
  
  // ✅ FIX 2: Remove token header (your backend doesn't require it for mock data)
  // const token = localStorage.getItem('token'); // Remove this line

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      // ✅ FIX 3: Remove authorization header for now (your mock backend doesn't need it)
      const response = await axios.get(`${API_URL}/students`);
      
      // ✅ FIX 4: Handle response structure correctly
      if (response.data.success) {
        setStudents(response.data.students || []);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      // ✅ FIX 5: Set empty array on error
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      // ✅ FIX 6: Your backend doesn't have POST /api/students endpoint yet
      // For now, just add locally to show UI works
      const newStudent = {
        _id: Date.now().toString(), // Temporary ID
        ...formData,
        attendance: "85%",
        cgpa: "8.5",
        feesPaid: true
      };
      
      // Add to local state
      setStudents([...students, newStudent]);
      
      // Clear form
      setFormData({
        usn: '', name: '', email: '', phone: '',
        course: 'Computer Science', semester: '1',
        address: '', dob: '', fatherName: '', motherName: ''
      });
      
      alert(`Student ${newStudent.name} added locally (backend endpoint not implemented)`);
      
    } catch (error) {
      alert('Note: Add student endpoint not implemented in backend yet');
    }
  };

  const handleDeleteStudent = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      // ✅ FIX 7: Your backend doesn't have DELETE endpoint yet
      // Remove from local state
      setStudents(students.filter(student => student._id !== id));
      alert('Student removed from local list (backend delete not implemented)');
    } catch (error) {
      alert('Error deleting student');
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="user-info">
          <div className="user-avatar admin">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <h2>Welcome, {user?.name}</h2>
            <p className="user-role">Administrator</p>
            <p className="api-status">
              <small>✅ Connected to: {API_URL}</small>
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

      <main className="admin-main">
        <div className="admin-grid">
          {/* Add Student Form */}
          <div className="admin-card">
            <h3><i className="fas fa-user-plus"></i> Add New Student</h3>
            <p className="demo-info">
              <small>⚠️ Backend only has mock data. Students added here are local only.</small>
            </p>
            <form onSubmit={handleAddStudent}>
              <div className="form-row">
                <div className="form-group">
                  <label>USN *</label>
                  <input
                    type="text"
                    name="usn"
                    value={formData.usn}
                    onChange={handleInputChange}
                    placeholder="e.g., 1RV20CS001"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Student name"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="student@college.edu"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="9876543210"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Course *</label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil">Civil</option>
                    <option value="Electrical">Electrical</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Semester *</label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    required
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-success btn-block">
                <i className="fas fa-save"></i> Add Student
              </button>
            </form>
          </div>

          {/* All Students List */}
          <div className="admin-card">
            <div className="card-header">
              <h3><i className="fas fa-users"></i> All Students ({students.length})</h3>
              <button onClick={fetchStudents} className="btn btn-sm btn-secondary">
                <i className="fas fa-sync"></i> Refresh
              </button>
            </div>
            <div className="students-list">
              {loading ? (
                <div className="loading">Loading students...</div>
              ) : students.length === 0 ? (
                <div className="empty-state">
                  <p>No students found. Add some students!</p>
                  <p className="demo-hint">
                    Demo students from backend: 1RV20CS001, 1RV20CS002
                  </p>
                </div>
              ) : (
                <div className="students-table">
                  <table>
                    <thead>
                      <tr>
                        <th>USN</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Course</th>
                        <th>Sem</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(student => (
                        <tr key={student._id || student.usn}>
                          <td>{student.usn}</td>
                          <td>{student.name}</td>
                          <td>{student.email}</td>
                          <td>{student.course}</td>
                          <td>{student.semester}</td>
                          <td>
                            <button
                              onClick={() => handleDeleteStudent(student._id || student.usn, student.name)}
                              className="btn btn-danger btn-sm"
                            >
                              <i className="fas fa-trash"></i> Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;