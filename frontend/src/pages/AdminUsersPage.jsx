import { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import { RoleBadge } from '../components/Badges';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/users/${id}`);
        fetchUsers();
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  const handleChangeRole = async (id, newRole) => {
    try {
      await axios.patch(`/users/${id}/role`, { role: newRole });
      fetchUsers();
    } catch (err) {
      alert('Failed to update role');
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="page-content">
      <header className="page-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">Admin only: Manage system users and roles</p>
        </div>
      </header>

      <div className="table-wrap card" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={u.avatar} className="avatar" style={{ width: 32, height: 32 }} alt="" />
                    <span style={{ fontWeight: 600 }}>{u.name}</span>
                  </div>
                </td>
                <td>{u.email}</td>
                <td><RoleBadge role={u.role} /></td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <select 
                      className="form-select btn-sm" 
                      value={u.role} 
                      onChange={(e) => handleChangeRole(u.id, e.target.value)}
                      style={{ width: 'auto' }}
                    >
                      <option value="USER">User</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;
