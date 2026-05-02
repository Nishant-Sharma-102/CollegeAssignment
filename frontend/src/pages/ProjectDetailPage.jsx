import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectAPI } from '../api/projectAPI';
import { taskAPI } from '../api/taskAPI';
import { userAPI } from '../api/dashboardAPI';
import { ProjectStatusBadge, PriorityBadge, StatusBadge } from '../components/Badges';
import { useAuth } from '../context/AuthContext';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, isAdmin } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    try {
      const [projRes, taskRes, userRes] = await Promise.all([
        projectAPI.getById(id),
        taskAPI.getAll({ projectId: id }),
        userAPI.getAll()
      ]);
      setProject(projRes.data);
      setTasks(taskRes.data);
      setAllUsers(userRes.data);
    } catch (err) {
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!selectedUserId) return;
    try {
      await projectAPI.addMember(id, selectedUserId);
      setShowAddMember(false);
      setSelectedUserId('');
      fetchProjectData();
    } catch (err) {
      alert('Error adding member');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Remove this member from project?')) return;
    try {
      await projectAPI.removeMember(id, userId);
      fetchProjectData();
    } catch (err) {
      alert('Error removing member');
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm('Are you sure you want to delete this project? This cannot be undone.')) return;
    try {
      await projectAPI.delete(id);
      navigate('/projects');
    } catch (err) {
      alert('Error deleting project');
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="page-content">
      <header className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <button className="btn-ghost" onClick={() => navigate('/projects')}>← Back</button>
            <ProjectStatusBadge status={project.status} />
          </div>
          <h1 className="page-title">{project.name}</h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {isAdmin && (
            <button className="btn btn-danger" onClick={handleDeleteProject}>Delete Project</button>
          )}
        </div>
      </header>

      <div className="grid-3" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Description Card */}
          <section className="card">
            <h2 className="card-title">Description</h2>
            <p style={{ marginTop: 12 }}>{project.description}</p>
            <div className="divider"></div>
            <div className="grid-3">
              <div>
                <label className="form-label">Deadline</label>
                <div style={{ fontWeight: 600 }}>{new Date(project.deadline).toLocaleDateString()}</div>
              </div>
              <div>
                <label className="form-label">Priority</label>
                <div><PriorityBadge priority={project.priority} /></div>
              </div>
              <div>
                <label className="form-label">Team</label>
                <div style={{ fontWeight: 600 }}>{project.teamName || 'No Team'}</div>
              </div>
            </div>
          </section>

          {/* Project Tasks */}
          <section className="card">
            <div className="card-header">
              <h2 className="card-title">Tasks ({tasks.length})</h2>
              <button className="btn btn-sm btn-primary" onClick={() => navigate('/tasks')}>Manage All</button>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Assignee</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map(task => (
                    <tr key={task.id}>
                      <td>{task.title}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {task.assignee?.avatar && <img src={task.assignee.avatar} className="avatar" style={{ width: 20, height: 20 }} alt="" />}
                          <span style={{ fontSize: '0.8rem' }}>{task.assignee?.name || 'Unassigned'}</span>
                        </div>
                      </td>
                      <td><StatusBadge status={task.status} /></td>
                    </tr>
                  ))}
                  {tasks.length === 0 && (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>
                        No tasks for this project yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Team Members Card */}
          <section className="card">
            <div className="card-header">
              <h2 className="card-title">Team Members</h2>
              {isAdmin && (
                <button className="btn btn-icon btn-ghost" onClick={() => setShowAddMember(!showAddMember)} title="Add Member">+</button>
              )}
            </div>
            
            {showAddMember && (
              <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
                <select 
                  className="form-select btn-sm" 
                  value={selectedUserId}
                  onChange={e => setSelectedUserId(e.target.value)}
                >
                  <option value="">Select User</option>
                  {allUsers
                    .filter(u => !project.members.some(m => m.id === u.id))
                    .map(u => <option key={u.id} value={u.id}>{u.name}</option>)
                  }
                </select>
                <button className="btn btn-sm btn-primary" onClick={handleAddMember}>Add</button>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {project.members.map(member => (
                <div key={member.id} style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={member.avatar} className="avatar" style={{ width: 32, height: 32 }} alt="" />
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{member.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{member.role}</div>
                    </div>
                  </div>
                  {isAdmin && member.id !== currentUser.id && (
                    <button className="btn-ghost" style={{ color: 'var(--danger)', padding: '2px 8px' }} onClick={() => handleRemoveMember(member.id)}>&times;</button>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="card">
            <h2 className="card-title">Project Manager</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
              {project.createdBy?.avatar && <img src={project.createdBy.avatar} className="avatar" style={{ width: 40, height: 40 }} alt="" />}
              <div>
                <div style={{ fontWeight: 600 }}>{project.createdBy?.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Lead</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
