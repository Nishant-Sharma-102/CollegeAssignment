import { useState, useEffect } from 'react';
import { taskAPI } from '../api/taskAPI';
import { projectAPI } from '../api/projectAPI';
import { userAPI } from '../api/dashboardAPI';
import { useAuth } from '../context/AuthContext';
import { StatusBadge, PriorityBadge } from '../components/Badges';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { user: currentUser } = useAuth();

  const [filters, setFilters] = useState({
    projectId: '',
    assigneeId: '',
    status: ''
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    assigneeId: '',
    dueDate: '',
    priority: 'MEDIUM',
    tags: ''
  });

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      const [taskRes, projRes, userRes] = await Promise.all([
        taskAPI.getAll(filters),
        projectAPI.getAll(),
        userAPI.getAll()
      ]);
      setTasks(taskRes.data);
      setProjects(projRes.data);
      setUsers(userRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await taskAPI.create(formData);
      setShowModal(false);
      setFormData({ title: '', description: '', projectId: '', assigneeId: '', dueDate: '', priority: 'MEDIUM', tags: '' });
      fetchData();
    } catch (err) {
      alert('Error creating task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskAPI.updateStatus(taskId, newStatus);
      fetchData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="page-content">
      <header className="page-header">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-subtitle">Track and manage your individual tasks</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <span>+</span> New Task
        </button>
      </header>

      <div className="filters-bar card">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <select 
            className="form-select search-input" 
            style={{ width: 180 }}
            value={filters.projectId}
            onChange={e => setFilters({...filters, projectId: e.target.value})}
          >
            <option value="">All Projects</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <select 
          className="form-select" 
          style={{ width: 150 }}
          value={filters.assigneeId}
          onChange={e => setFilters({...filters, assigneeId: e.target.value})}
        >
          <option value="">All Assignees</option>
          {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
        <select 
          className="form-select" 
          style={{ width: 150 }}
          value={filters.status}
          onChange={e => setFilters({...filters, status: e.target.value})}
        >
          <option value="">All Statuses</option>
          <option value="TO_DO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="REVIEW">Review</option>
          <option value="DONE">Done</option>
        </select>
      </div>

      <div className="table-wrap card" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr>
              <th>Task</th>
              <th>Project</th>
              <th>Assignee</th>
              <th>Due Date</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{task.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {Array.isArray(task.tags) 
                      ? task.tags.map(tag => <span key={tag} className="tag" style={{ marginRight: 4 }}>{tag}</span>)
                      : task.tags?.split(',').map(tag => <span key={tag} className="tag" style={{ marginRight: 4 }}>{tag}</span>)
                    }
                  </div>
                </td>
                <td>{task.projectName}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {task.assignee?.avatar && <img src={task.assignee.avatar} className="avatar" style={{ width: 24, height: 24 }} alt="" />}
                    <span>{task.assignee?.name || 'Unassigned'}</span>
                  </div>
                </td>
                <td>
                  <span style={{ color: task.overdue ? 'var(--danger)' : 'inherit' }}>
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </td>
                <td><PriorityBadge priority={task.priority} /></td>
                <td><StatusBadge status={task.status} /></td>
                <td>
                  <select 
                    className="form-select btn-sm" 
                    value={task.status} 
                    onChange={e => handleStatusChange(task.id, e.target.value)}
                    style={{ width: 'auto' }}
                  >
                    <option value="TO_DO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="REVIEW">Review</option>
                    <option value="DONE">Done</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tasks.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">✅</div>
            <h3>No tasks found</h3>
            <p>Try adjusting your filters or create a new task.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Create New Task</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input 
                  className="form-input" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
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
                  <label className="form-label">Project</label>
                  <select 
                    className="form-select" 
                    value={formData.projectId} 
                    onChange={e => setFormData({...formData, projectId: e.target.value})}
                    required
                  >
                    <option value="">Select Project</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Assignee</label>
                  <select 
                    className="form-select" 
                    value={formData.assigneeId} 
                    onChange={e => setFormData({...formData, assigneeId: e.target.value})}
                    required
                  >
                    <option value="">Select Assignee</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={formData.dueDate} 
                    onChange={e => setFormData({...formData, dueDate: e.target.value})}
                    required 
                  />
                </div>
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
              </div>
              <div className="form-group">
                <label className="form-label">Tags (comma separated)</label>
                <input 
                  className="form-input" 
                  placeholder="e.g. frontend, bug, api"
                  value={formData.tags} 
                  onChange={e => setFormData({...formData, tags: e.target.value})}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;
