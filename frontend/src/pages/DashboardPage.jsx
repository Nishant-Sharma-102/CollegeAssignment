import { useState, useEffect } from 'react';
import { dashboardAPI } from '../api/dashboardAPI';
import { StatusBadge, PriorityBadge } from '../components/Badges';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardAPI.getDashboard();
        setData(res.data);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="loading"><div className="spinner"></div></div>;
  if (error) return <div className="page-content"><div className="alert alert-error">{error}</div></div>;

  return (
    <div className="page-content">
      <header className="page-header">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-subtitle">Welcome back! Here's what's happening today.</p>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card accent">
          <div className="stat-icon accent">📁</div>
          <div className="stat-value">{data.projectProgress?.length || 0}</div>
          <div className="stat-label">Active Projects</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon purple">✅</div>
          <div className="stat-value">{data.totalTasks}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon success">🏆</div>
          <div className="stat-value">{data.completedTasks}</div>
          <div className="stat-label">Tasks Completed</div>
        </div>
        <div className="stat-card danger">
          <div className="stat-icon danger">⏰</div>
          <div className="stat-value">{data.overduetaskList?.length || 0}</div>
          <div className="stat-label">Overdue Tasks</div>
        </div>
      </div>

      <div className="grid-2">
        {/* Project Progress */}
        <section className="card">
          <div className="card-header">
            <h2 className="card-title">Project Progress</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {data.projectProgress?.map(proj => (
              <div key={proj.projectName}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{proj.projectName}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{proj.progressPercent}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${proj.progressPercent}%` }}></div>
                </div>
              </div>
            ))}
            {(!data.projectProgress || data.projectProgress.length === 0) && (
              <div className="empty-state">
                <p>No active projects found.</p>
              </div>
            )}
          </div>
        </section>

        {/* Overdue Tasks */}
        <section className="card">
          <div className="card-header">
            <h2 className="card-title">Urgent / Overdue Tasks</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data.overduetaskList?.map(task => (
              <div key={task.id} className="task-card overdue">
                <div className="task-card-header">
                  <h3 className="task-card-title">{task.title}</h3>
                  <PriorityBadge priority={task.priority} />
                </div>
                <div className="task-card-meta">
                  <span style={{ color: 'var(--danger)', fontSize: '0.75rem', fontWeight: 600 }}>
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                  <div className="task-card-assignee">
                    {task.assignee?.avatar && <img src={task.assignee.avatar} className="avatar" style={{ width: 20, height: 20 }} alt="" />}
                    <span>{task.assignee?.name || 'Unassigned'}</span>
                  </div>
                </div>
              </div>
            ))}
            {(!data.overduetaskList || data.overduetaskList.length === 0) && (
              <div className="empty-state">
                <p>Great job! No overdue tasks.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
