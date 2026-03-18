import { useState, useEffect } from 'react';
import { applicationsAPI } from '../api';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

export default function UserDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const { data } = await applicationsAPI.getMine();
        setApplications(data.data);
      } catch (err) {
        setError('Failed to load your applications.');
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  if (loading) return <div style={{ paddingTop: '10vh' }}><LoadingSpinner size="lg" text="Loading applications..." /></div>;

  return (
    <div className="page-container animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="section-title">My Applications</h1>
        <p className="section-sub">Track the status of your pet adoption requests.</p>
      </div>

      {error ? (
        <div style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(239,68,68,0.2)' }}>
          {error}
        </div>
      ) : applications.length === 0 ? (
        <EmptyState 
          type="applications"
          title="No applications yet"
          description="You haven't applied to adopt any pets."
          action={<Link to="/" className="btn-primary">Browse Available Pets</Link>}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '1.5rem', md: { gridTemplateColumns: '1fr 1fr' } }}>
          {applications.map((app) => (
            <div key={app._id} className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', flexGrow: 1 }}>
                
                {/* Pet Image Thumbnail */}
                <div style={{ width: '100px', flexShrink: 0 }}>
                  <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '0.5rem', overflow: 'hidden', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {app.pet?.photo ? (
                      <img 
                        src={app.pet.photo.startsWith('http') ? app.pet.photo : `/api${app.pet.photo}`} 
                        alt={app.pet.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <span style={{ fontSize: '2rem', color: 'var(--border)' }}>{app.pet?.name?.[0] || '?'}</span>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Link to={`/pet/${app.pet?._id}`} style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0, transition: 'color 0.2s' }} onMouseOver={e=>e.target.style.color='var(--accent)'} onMouseOut={e=>e.target.style.color='var(--text-primary)'}>
                        {app.pet?.name || 'Unknown Pet'}
                      </h3>
                    </Link>
                    <span className={`badge badge-${app.status}`}>
                      {app.status}
                    </span>
                  </div>
                  
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem', textTransform: 'capitalize' }}>
                    {app.pet?.breed} • {app.pet?.species}
                  </div>

                  <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Applied on</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                      {new Date(app.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {app.adminNote && (
                <div style={{ padding: '1rem 1.5rem', background: 'rgba(59, 130, 246, 0.05)', borderTop: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--info)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Admin Note</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{app.adminNote}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
