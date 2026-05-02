import { useState, useEffect } from 'react';
import { projectAPI } from '../api/projectAPI';
import { teamAPI } from '../api/teamAPI';
import { useAuth } from '../context/AuthContext';
import { ProjectStatusBadge, PriorityBadge } from '../components/Badges';
import { useNavigate } from 'react-router-dom';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    deadline: '',
    priority: 'MEDIUM',
    status: 'PLANNING',
    teamId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projRes, teamRes] = await Promise.all([
        projectAPI.getAll(),
        teamAPI.getAll()
      ]);
      setProjects(projRes.data);
      setTeams(teamRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await projectAPI.create(formData);
      setShowModal(false);
      setFormData({ name: '', description: '', deadline: '', priority: 'MEDIUM', status: 'PLANNING', teamId: '' });
      fetchData();
    } catch (err) {
      alert('Error creating project');
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="page-content">
      <header className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">Manage and track your ongoing projects</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <span>+</span> New Project
          </button>
        )}
      </header>

      <div className="grid-auto">
        {projects.map(project => (
          <div key={project.id} className="project-card" onClick={() => navigate(`/projects/${project.id}`)}>
            <div className="project-card-header">
              <h3 className="project-card-title">{project.name}</h3>
              <PriorityBadge priority={project.priority} />
            </div>
            <p className="project-card-desc">{project.description}</p>
            <div style={{ margin: '8px 0' }}>
              <ProjectStatusBadge status={project.status} />
            </div>
            <div className="divider"></div>
            <div className="project-card-meta">
              <span>📅 {new Date(project.deadline).toLocaleDateString()}</span>
              <div className="avatar-stack">
                {project.members.slice(0, 3).map(m => (
                  <img key={m.id} src={m.avatar} className="avatar" style={{ width: 24, height: 24 }} title={m.name} alt="" />
                ))}
                {project.members.length > 3 && (
                  <div className="avatar" style={{ width: 24, height: 24, background: 'var(--bg-hover)', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: -8 }}>
                    +{project.members.length - 3}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="empty-state" style={{ gridColumn: '1/-1' }}>
            <div className="empty-state-icon">📁</div>
            <h3>No projects yet</h3>
            <p>Get started by creating your first project.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Create New Project</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Project Name</label>
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
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Deadline</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={formData.deadline} 
                    onChange={e => setFormData({...formData, deadline: e.target.value})}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Team</label>
                  <select 
                    className="form-select" 
                    value={formData.teamId} 
                    onChange={e => setFormData({...formData, teamId: e.target.value})}
                  >
                    <option value="">No Team Assigned</option>
                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select 
                    className="form-select" 
                    value={formData.priority} 
                    onChange={e => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Initial Status</label>
                  <select 
                    className="form-select" 
                    value={formData.status} 
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="PLANNING">Planning</option>
                    <option value="ACTIVE">Active</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
