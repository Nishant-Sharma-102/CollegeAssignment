import { useAuth } from '../context/AuthContext';
import { RoleBadge } from '../components/Badges';

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="page-content">
      <header className="page-header">
        <div>
          <h1 className="page-title">User Profile</h1>
          <p className="page-subtitle">Your personal account information</p>
        </div>
      </header>

      <div style={{ maxWidth: 600 }}>
        <section className="card">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
            <img 
              src={user.avatar} 
              className="avatar" 
              style={{ width: 120, height: 120, border: '4px solid var(--bg-hover)', marginBottom: 16 }} 
              alt={user.name} 
            />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{user.name}</h2>
            <div style={{ marginTop: 8 }}><RoleBadge role={user.role} /></div>
          </div>

          <div className="divider"></div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '0 20px' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ padding: '10px 14px', background: 'var(--bg-hover)', borderRadius: 'var(--radius-sm)' }}>
                {user.name}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ padding: '10px 14px', background: 'var(--bg-hover)', borderRadius: 'var(--radius-sm)' }}>
                {user.email}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <div style={{ padding: '10px 14px', background: 'var(--bg-hover)', borderRadius: 'var(--radius-sm)' }}>
                {user.role}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">User ID</label>
              <div style={{ padding: '10px 14px', background: 'var(--bg-hover)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {user.id}
              </div>
            </div>
          </div>

          <div style={{ padding: '20px', marginTop: 10 }}>
            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => alert('Profile editing is disabled in this version.')}>
              Edit Profile
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
