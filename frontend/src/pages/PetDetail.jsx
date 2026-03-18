import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { petsAPI, applicationsAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function PetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Application Modal State
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [form, setForm] = useState({ message: '', phoneNumber: '', address: '', hasOtherPets: false });
  const [submitting, setSubmitting] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState('');

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const { data } = await petsAPI.getById(id);
        setPet(data.data);
      } catch (err) {
        setError('Pet not found or server error');
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setApplyError('');
    
    try {
      await applicationsAPI.submit({
        petId: pet._id,
        ...form
      });
      setApplySuccess('Application submitted successfully! You can track its status in your dashboard.');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setApplyError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ paddingTop: '10vh' }}><LoadingSpinner size="lg" /></div>;
  if (error || !pet) return (
    <div className="page-container" style={{ textAlign: 'center', paddingTop: '10vh' }}>
      <h2 className="section-title">Oops!</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{error}</p>
      <Link to="/" className="btn-primary">Back to Pets</Link>
    </div>
  );

  return (
    <div className="page-container animate-fade-in">
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '2rem' }}>
        ← Back to all pets
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '2.5rem', md: { gridTemplateColumns: '1fr 1fr' } }}>
        {/* Left Column - Image */}
        <div style={{ borderRadius: '1rem', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--bg-card)', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {pet.photo ? (
            <img 
              src={pet.photo.startsWith('http') ? pet.photo : `/api${pet.photo}`} 
              alt={pet.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <span style={{ fontSize: '5rem', fontWeight: 800, color: 'var(--border)' }}>{pet.name[0]}</span>
          )}
        </div>

        {/* Right Column - Details */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{pet.name}</h1>
            <span className={`badge badge-${pet.status}`} style={{ fontSize: '0.875rem', padding: '0.35rem 0.8rem' }}>
              {pet.status}
            </span>
          </div>
          
          <p style={{ color: 'var(--accent)', fontSize: '1.125rem', fontWeight: 500, marginBottom: '1.5rem', textTransform: 'capitalize' }}>
            {pet.breed} • {pet.species}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            <div className="card" style={{ padding: '1rem' }}>
              <div className="label">Age</div>
              <div style={{ fontWeight: 500 }}>{pet.age} years</div>
            </div>
            <div className="card" style={{ padding: '1rem' }}>
              <div className="label">Gender</div>
              <div style={{ fontWeight: 500, textTransform: 'capitalize' }}>{pet.gender}</div>
            </div>
            <div className="card" style={{ padding: '1rem' }}>
              <div className="label">Size</div>
              <div style={{ fontWeight: 500, textTransform: 'capitalize' }}>{pet.size}</div>
            </div>
            <div className="card" style={{ padding: '1rem' }}>
              <div className="label">Location</div>
              <div style={{ fontWeight: 500 }}>{pet.location || 'Shelter'}</div>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.75rem' }}>About {pet.name}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{pet.description}</p>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: pet.vaccinated ? 'var(--success)' : 'var(--border)' }} />
              <span style={{ color: pet.vaccinated ? 'var(--text-primary)' : 'var(--text-muted)' }}>Vaccinated</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: pet.neutered ? 'var(--success)' : 'var(--border)' }} />
              <span style={{ color: pet.neutered ? 'var(--text-primary)' : 'var(--text-muted)' }}>Neutered/Spayed</span>
            </div>
          </div>

          {/* Action Button */}
          {pet.status === 'available' ? (
            <button 
              className="btn-primary" 
              style={{ padding: '1rem 2rem', fontSize: '1.125rem', width: '100%' }}
              onClick={() => {
                if (!isAuthenticated) navigate('/register', { state: { from: `/pet/${pet._id}` } });
                else setShowApplyModal(true);
              }}
            >
              {isAuthenticated ? 'Apply to Adopt' : 'Register to Apply'}
            </button>
          ) : (
            <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '0.5rem', textAlign: 'center', border: '1px solid var(--border)' }}>
              This pet currently has a <strong>{pet.status}</strong> status and is not accepting applications.
            </div>
          )}
        </div>
      </div>

      {/* Application Modal Overlay */}
      {showApplyModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="section-title" style={{ margin: 0 }}>Adoption Application</h2>
              <button onClick={() => setShowApplyModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              You are applying to adopt <strong>{pet.name}</strong>. Please provide some details to help us evaluate your application.
            </p>

            {applySuccess ? (
              <div style={{ background: 'rgba(34,197,94,0.1)', color: 'var(--success)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(34,197,94,0.2)', textAlign: 'center' }}>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>🎉</span>
                {applySuccess}
              </div>
            ) : (
              <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {applyError && (
                  <div style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem' }}>
                    {applyError}
                  </div>
                )}

                <div>
                  <label className="label">Why would you be a good fit? *</label>
                  <textarea 
                    className="input" 
                    rows={4} 
                    required
                    placeholder="Tell us about yourself and your home..."
                    value={form.message}
                    onChange={e => setForm({...form, message: e.target.value})}
                  />
                </div>

                <div>
                  <label className="label">Phone Number</label>
                  <input 
                    type="tel" 
                    className="input" 
                    value={form.phoneNumber}
                    onChange={e => setForm({...form, phoneNumber: e.target.value})}
                  />
                </div>

                <div>
                  <label className="label">Address</label>
                  <input 
                    type="text" 
                    className="input" 
                    value={form.address}
                    onChange={e => setForm({...form, address: e.target.value})}
                  />
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={form.hasOtherPets}
                    onChange={e => setForm({...form, hasOtherPets: e.target.checked})}
                    style={{ width: '1.1rem', height: '1.1rem', accentColor: 'var(--accent)' }}
                  />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>I currently have other pets at home</span>
                </label>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setShowApplyModal(false)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Form'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
