import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { petsAPI } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminPetForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [form, setForm] = useState({
    name: '',
    species: 'dog',
    breed: '',
    age: '',
    gender: 'unknown',
    size: 'medium',
    description: '',
    status: 'available',
    vaccinated: false,
    neutered: false,
    color: '',
    location: ''
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

  useEffect(() => {
    if (isEdit) {
      const fetchPet = async () => {
        try {
          const { data } = await petsAPI.getById(id);
          const pet = data.data;
          setForm({
            name: pet.name || '',
            species: pet.species || 'dog',
            breed: pet.breed || '',
            age: pet.age || '',
            gender: pet.gender || 'unknown',
            size: pet.size || 'medium',
            description: pet.description || '',
            status: pet.status || 'available',
            vaccinated: pet.vaccinated || false,
            neutered: pet.neutered || false,
            color: pet.color || '',
            location: pet.location || ''
          });
          if (pet.photo) {
            setPhotoPreview(pet.photo.startsWith('http') ? pet.photo : `/api${pet.photo}`);
          }
        } catch (err) {
          setError('Failed to load pet details for editing');
        } finally {
          setLoading(false);
        }
      };
      fetchPet();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size too large (max 5MB)');
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const formData = new FormData();
    Object.keys(form).forEach(key => {
      formData.append(key, form[key]);
    });
    if (photoFile) {
      formData.append('photo', photoFile);
    }

    try {
      if (isEdit) {
        await petsAPI.update(id, formData);
      } else {
        await petsAPI.create(formData);
      }
      navigate('/admin/pets');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to save pet');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ paddingTop: '10vh' }}><LoadingSpinner size="lg" /></div>;

  return (
    <div className="page-container animate-fade-in" style={{ maxWidth: '800px' }}>
      <Link to="/admin/pets" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '2rem' }}>
        ← Back to Pet List
      </Link>

      <div className="card" style={{ padding: '2rem' }}>
        <h1 className="section-title" style={{ marginBottom: '1.5rem' }}>{isEdit ? 'Edit Pet' : 'Add New Pet'}</h1>
        
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(239,68,68,0.2)', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Photo Upload area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
            <label className="label">Pet Photo</label>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ width: 120, height: 120, borderRadius: '0.5rem', overflow: 'hidden', border: '2px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)', position: 'relative' }}>
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ color: 'var(--text-muted)', fontSize: '2rem' }}>📷</span>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input 
                  type="file" 
                  id="photo" 
                  accept="image/jpeg,image/png,image/webp" 
                  onChange={handlePhotoChange} 
                  style={{ display: 'none' }} 
                />
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => document.getElementById('photo').click()}
                >
                  Choose Image
                </button>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>JPEG, PNG up to 5MB</div>
              </div>
            </div>
          </div>

          <div className="divider" style={{ margin: '0' }}/>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '1.5rem', md: { gridTemplateColumns: '1fr 1fr' } }}>
            <div>
              <label className="label">Name *</label>
              <input type="text" className="input" name="name" value={form.name} onChange={handleChange} required />
            </div>
            
            <div>
              <label className="label">Species *</label>
              <select className="select" name="species" value={form.species} onChange={handleChange} required>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="bird">Bird</option>
                <option value="rabbit">Rabbit</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '1.5rem', md: { gridTemplateColumns: '1fr 1fr 1fr' } }}>
            <div>
              <label className="label">Breed *</label>
              <input type="text" className="input" name="breed" value={form.breed} onChange={handleChange} required />
            </div>
            <div>
              <label className="label">Age (years) *</label>
              <input type="number" step="0.1" min="0" className="input" name="age" value={form.age} onChange={handleChange} required />
            </div>
            <div>
              <label className="label">Gender</label>
              <select className="select" name="gender" value={form.gender} onChange={handleChange}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '1.5rem', md: { gridTemplateColumns: '1fr 1fr' } }}>
            <div>
              <label className="label">Size</label>
              <select className="select" name="size" value={form.size} onChange={handleChange}>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="extra-large">Extra Large</option>
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select className="select" name="status" value={form.status} onChange={handleChange}>
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="adopted">Adopted</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Description *</label>
            <textarea 
              className="input" 
              name="description" 
              rows={4} 
              value={form.description} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '1.5rem', md: { gridTemplateColumns: '1fr 1fr' } }}>
            <div>
              <label className="label">Color</label>
              <input type="text" className="input" name="color" value={form.color} onChange={handleChange} />
            </div>
            <div>
              <label className="label">Location</label>
              <input type="text" className="input" name="location" value={form.location} onChange={handleChange} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '2rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" name="vaccinated" checked={form.vaccinated} onChange={handleChange} style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--accent)' }} />
              <span>Vaccinated</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" name="neutered" checked={form.neutered} onChange={handleChange} style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--accent)' }} />
              <span>Neutered / Spayed</span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <Link to="/admin/pets" className="btn-secondary" style={{ flex: 1 }}>Cancel</Link>
            <button type="submit" className="btn-primary" style={{ flex: 2 }} disabled={submitting}>
              {submitting ? 'Saving...' : isEdit ? 'Update Pet' : 'Create Pet'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
