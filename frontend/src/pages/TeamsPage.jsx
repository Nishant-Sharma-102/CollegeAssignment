import { useState, useEffect } from 'react';
import { teamAPI } from '../api/teamAPI';
import { userAPI } from '../api/dashboardAPI';
import { useAuth } from '../context/AuthContext';

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { isAdmin, user: currentUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [teamRes, userRes] = await Promise.all([
        teamAPI.getAll(),
        userAPI.getAll()
      ]);
      setTeams(teamRes.data);
      setAllUsers(userRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await teamAPI.create(formData);
      setShowModal(false);
      setFormData({ name: '', description: '' });
      fetchData();
    } catch (err) {
      alert('Error creating team');
    }
  };

  const handleAddMember = async (teamId, userId) => {
    try {
      await teamAPI.addMember(teamId, userId);
      fetchData();
    } catch (err) {
      alert('Error adding member');
    }
  };

  const handleRemoveMember = async (teamId, userId) => {
    if (!window.confirm('Remove member from team?')) return;
    try {
      await teamAPI.removeMember(teamId, userId);
      fetchData();
    } catch (err) {
      alert('Error removing member');
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="page-content">
      <header className="page-header">
        <div>
          <h1 className="page-title">Teams</h1>
          <p className="page-subtitle">Organize users and collaborate more effectively</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <span>+</span> New Team
          </button>
        )}
      </header>

      <div className="grid-2">
        {teams.map(team => (
          <div key={team.id} className="card">
            <div className="card-header">
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{team.name}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Created by {team.createdByName}</p>
              </div>
            </div>
            <p style={{ fontSize: '0.875rem', marginBottom: 16 }}>{team.description}</p>
            
            <div className="divider"></div>
            
            <div style={{ marginBottom: 12 }}>
              <h4 className="card-title" style={{ fontSize: '0.75rem', marginBottom: 12 }}>Members ({team.members.length})</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {team.members.map(member => (
                  <div key={member.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <img src={member.avatar} className="avatar" style={{ width: 28, height: 28 }} alt="" />
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{member.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{member.role}</div>
                      </div>
                    </div>
                    {isAdmin && member.id !== team.createdBy && (
                      <button className="btn-ghost" style={{ color: 'var(--danger)', fontSize: '0.9rem' }} onClick={() => handleRemoveMember(team.id, member.id)}>&times;</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {isAdmin && (
              <div style={{ marginTop: 16 }}>
                <select 
                  className="form-select btn-sm"
                  onChange={(e) => {
                    if (e.target.value) handleAddMember(team.id, e.target.value);
                    e.target.value = '';
                  }}
                >
                  <option value="">Add Member to Team...</option>
                  {allUsers
                    .filter(u => !team.members.some(m => m.id === u.id))
                    .map(u => <option key={u.id} value={u.id}>{u.name}</option>)
                  }
                </select>
              </div>
            )}
          </div>
        ))}
        {teams.length === 0 && (
          <div className="empty-state" style={{ gridColumn: '1/-1' }}>
            <div className="empty-state-icon">👥</div>
            <h3>No teams yet</h3>
            <p>Group users together to simplify project assignment.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Create New Team</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Team Name</label>
                <input 
                  className="form-input" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-textarea" 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  required 
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Team</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamsPage;
