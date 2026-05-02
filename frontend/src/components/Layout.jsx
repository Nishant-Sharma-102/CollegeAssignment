import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/projects', icon: '📁', label: 'Projects' },
  { to: '/tasks', icon: '✅', label: 'Tasks' },
  { to: '/teams', icon: '👥', label: 'Teams' },
];

const Layout = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🚀</div>
          <span className="sidebar-logo-text">ProjectFlow</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Main</div>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}

          <div className="nav-section-label" style={{ marginTop: 16 }}>Account</div>
          <NavLink
            to="/profile"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">👤</span>
            Profile
          </NavLink>

          {isAdmin && (
            <>
              <div className="nav-section-label" style={{ marginTop: 16 }}>Admin</div>
              <NavLink
                to="/users"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <span className="nav-icon">⚙️</span>
                Users
              </NavLink>
            </>
          )}
        </nav>

        {/* User info at bottom */}
        <div className="sidebar-user">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="sidebar-user-avatar avatar"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=6366f1&color=fff`;
            }}
          />
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name}</div>
            <div className="sidebar-user-role">{user?.role}</div>
          </div>
          <button className="logout-btn btn-icon" onClick={handleLogout} title="Logout">
            ↩
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
