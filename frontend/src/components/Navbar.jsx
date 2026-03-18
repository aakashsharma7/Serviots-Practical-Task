import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const PawIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM6.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM17.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM4 8a1.5 1.5 0 1 0 0 3A1.5 1.5 0 0 0 4 8zM20 8a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM12 10c-3.5 0-7 2-7 5.5 0 2.5 2 4.5 7 4.5s7-2 7-4.5C19 12 15.5 10 12 10z"/>
  </svg>
);

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `text-sm font-medium transition-colors px-3 py-1.5 rounded-md ${
      isActive(path)
        ? 'text-[var(--accent)] bg-[var(--accent-glow)]'
        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
    }`;

  return (
    <nav
      style={{
        background: 'rgba(10,10,15,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          {/* Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
            }}
          >
            <span style={{ color: 'var(--accent)' }}>
              <PawIcon />
            </span>
            <span
              style={{
                fontWeight: 700,
                fontSize: '1.125rem',
                background: 'linear-gradient(135deg, #f0f0f8, var(--accent))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              PetAdopt
            </span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="hidden md:flex">
            <Link to="/" className={navLinkClass('/')}>Browse Pets</Link>
            {isAuthenticated && (
              <Link to="/dashboard" className={navLinkClass('/dashboard')}>My Applications</Link>
            )}
            {isAdmin && (
              <>
                <Link to="/admin/pets" className={navLinkClass('/admin/pets')}>Manage Pets</Link>
                <Link to="/admin/applications" className={navLinkClass('/admin/applications')}>Applications</Link>
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="hidden md:flex">
            {isAuthenticated ? (
              <>
                <span
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    paddingRight: '0.5rem',
                    borderRight: '1px solid var(--border)',
                  }}
                >
                  <span style={{ color: 'var(--text-muted)' }}>Hi, </span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{user?.name?.split(' ')[0]}</span>
                  {isAdmin && (
                    <span
                      style={{
                        marginLeft: '0.375rem',
                        fontSize: '0.65rem',
                        background: 'var(--accent-glow)',
                        color: 'var(--accent)',
                        border: '1px solid rgba(124,110,247,0.3)',
                        borderRadius: '4px',
                        padding: '1px 5px',
                        fontWeight: 600,
                      }}
                    >
                      ADMIN
                    </span>
                  )}
                </span>
                <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.4rem 0.875rem', fontSize: '0.8rem' }}>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary" style={{ padding: '0.4rem 0.875rem', fontSize: '0.8rem' }}>
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary" style={{ padding: '0.4rem 0.875rem', fontSize: '0.8rem' }}>
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: '0.5rem',
            }}
          >
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            style={{
              paddingBottom: '1rem',
              borderTop: '1px solid var(--border)',
              paddingTop: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
            }}
            className="md:hidden"
          >
            <Link to="/" className={navLinkClass('/')} onClick={() => setMobileOpen(false)}>Browse Pets</Link>
            {isAuthenticated && (
              <Link to="/dashboard" className={navLinkClass('/dashboard')} onClick={() => setMobileOpen(false)}>My Applications</Link>
            )}
            {isAdmin && (
              <>
                <Link to="/admin/pets" className={navLinkClass('/admin/pets')} onClick={() => setMobileOpen(false)}>Manage Pets</Link>
                <Link to="/admin/applications" className={navLinkClass('/admin/applications')} onClick={() => setMobileOpen(false)}>Applications</Link>
              </>
            )}
            <hr className="divider" style={{ margin: '0.75rem 0' }} />
            {isAuthenticated ? (
              <button onClick={handleLogout} className="btn-secondary" style={{ justifyContent: 'flex-start' }}>
                Sign Out
              </button>
            ) : (
              <>
                <Link to="/login" className="btn-secondary" onClick={() => setMobileOpen(false)}>Sign In</Link>
                <Link to="/register" className="btn-primary" onClick={() => setMobileOpen(false)}>Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
