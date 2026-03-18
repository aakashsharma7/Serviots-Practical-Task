import { useState, useEffect } from 'react';
import { applicationsAPI } from '../api';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

export default function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [processingId, setProcessingId] = useState(null);
  const [adminNote, setAdminNote] = useState({});

  const fetchApps = async () => {
    setLoading(true);
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const { data } = await applicationsAPI.getAll(params);
      setApplications(data.data);
    } catch (err) {
      setError('Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, [statusFilter]);

  const handleStatusUpdate = async (id, newStatus) => {
    setProcessingId(id);
    try {
      const note = adminNote[id] || '';
      await applicationsAPI.updateStatus(id, { status: newStatus, adminNote: note });
      // Refresh list
      fetchApps();
      // Clear note
      setAdminNote(prev => ({...prev, [id]: ''}));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="section-title">Manage Applications</h1>
          <p className="section-sub" style={{ marginBottom: 0 }}>Review and approve/reject adoption requests.</p>
        </div>
        
        <div>
          <select 
            className="select" 
            style={{ width: '200px' }}
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '10vh 0' }}><LoadingSpinner size="lg" /></div>
      ) : error ? (
        <div style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>
      ) : applications.length === 0 ? (
        <EmptyState 
          type="applications"
          title="No applications found"
          description="No applications match the current filter."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {applications.map((app) => (
            <div key={app._id} className="card" style={{ padding: '1.5rem' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', flexDirection: 'column', md: { flexDirection: 'row' } }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', md: { marginBottom: 0 } }}>
                   <div style={{ width: '60px', height: '60px', borderRadius: '0.5rem', overflow: 'hidden', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {app.pet?.photo ? (
                      <img src={app.pet.photo.startsWith('http') ? app.pet.photo : `/api${app.pet.photo}`} alt={app.pet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '1.5rem', color: 'var(--border)' }}>{app.pet?.name?.[0] || '?'}</span>
                    )}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, margin: '0 0 0.25rem 0' }}>
                      <Link to={`/pet/${app.pet?._id}`} style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>
                        {app.pet?.name || 'Unknown Pet'}
                      </Link>
                    </h3>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      Status: <span className={`badge badge-${app.pet?.status || 'available'}`} style={{ fontSize: '0.65rem', marginLeft: '0.5rem' }}>{app.pet?.status}</span>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'left', md: { textAlign: 'right' } }}>
                  <div style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{app.user?.name}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <a href={`mailto:${app.user?.email}`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>{app.user?.email}</a>
                    {app.phoneNumber && <span> • {app.phoneNumber}</span>}
                  </div>
                  <span className={`badge badge-${app.status}`}>{app.status}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '1.5rem', md: { gridTemplateColumns: '2fr 1fr' } }}>
                <div>
                  <h4 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', fontWeight: 600 }}>Message from Applicant</h4>
                  <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '0.5rem', fontSize: '0.9rem', lineHeight: 1.6, border: '1px solid var(--border)' }}>
                    {app.message}
                  </div>
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '2rem' }}>
                    <div>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Address: </span>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{app.address || 'N/A'}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Other Pets: </span>
                      <span style={{ fontSize: '0.875rem', color: app.hasOtherPets ? 'var(--warning)' : 'var(--text-primary)' }}>{app.hasOtherPets ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>

                {app.status === 'pending' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
                    <label className="label">Admin Note (optional)</label>
                    <textarea 
                      className="input" 
                      rows={2} 
                      placeholder="Reason for approval/rejection..."
                      value={adminNote[app._id] || ''}
                      onChange={e => setAdminNote({...adminNote, [app._id]: e.target.value})}
                      style={{ marginBottom: '0.5rem' }}
                    />
                    <button 
                      className="btn-primary" 
                      style={{ background: 'var(--success)', width: '100%' }}
                      disabled={processingId === app._id}
                      onClick={() => handleStatusUpdate(app._id, 'approved')}
                    >
                      {processingId === app._id ? 'Processing...' : 'Approve Application'}
                    </button>
                    <button 
                      className="btn-danger" 
                      style={{ width: '100%' }}
                      disabled={processingId === app._id}
                      onClick={() => handleStatusUpdate(app._id, 'rejected')}
                    >
                      {processingId === app._id ? 'Processing...' : 'Reject Application'}
                    </button>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.5rem' }}>
                      Approving will auto-update pet status to 'adopted' and reject competing applications.
                    </div>
                  </div>
                ) : (
                  <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      Resolved on: <span style={{ color: 'var(--text-primary)' }}>{new Date(app.updatedAt).toLocaleDateString()}</span>
                    </div>
                    {app.adminNote && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Admin Note:</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{app.adminNote}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
