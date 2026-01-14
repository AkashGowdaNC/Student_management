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

  const API_URL = 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
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
      const response = await axios.post(`${API_URL}/students`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert(response.data.message);
      setFormData({
        usn: '', name: '', email: '', phone: '',
        course: 'Computer Science', semester: '1',
        address: '', dob: '', fatherName: '', motherName: ''
      });
      fetchStudents();
    } catch (error) {
      alert(error.response?.data?.error || 'Error adding student');
    }
  };

  const handleDeleteStudent = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      await axios.delete(`${API_URL}/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Student deleted successfully!');
      fetchStudents();
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
            <h3><i className="fas fa-users"></i> All Students ({students.length})</h3>
            <div className="students-list">
              {loading ? (
                <p>Loading students...</p>
              ) : students.length === 0 ? (
                <p>No students found. Add some students!</p>
              ) : (
                <div className="students-table">
                  <table>
                    <thead>
                      <tr>
                        <th>USN</th>
                        <th>Name</th>
                        <th>Course</th>
                        <th>Sem</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(student => (
                        <tr key={student._id}>
                          <td>{student.usn}</td>
                          <td>{student.name}</td>
                          <td>{student.course}</td>
                          <td>{student.semester}</td>
                          <td>
                            <button
                              onClick={() => handleDeleteStudent(student._id, student.name)}
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