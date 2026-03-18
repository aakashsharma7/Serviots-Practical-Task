import { useState, useEffect } from 'react';
import { petsAPI } from '../api';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

export default function AdminPets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  
  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const params = { page: currentPage, limit: 10 };
      if (search) params.search = search;
      if (status) params.status = status;
      
      const { data } = await petsAPI.getAllAdmin(params);
      setPets(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError('Failed to load pets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [currentPage, status]); // Search handles manually via form

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to page 1
    fetchPets();
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      try {
        await petsAPI.delete(id);
        fetchPets(); // Refresh
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete pet');
      }
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexDirection: 'column', gap: '1rem', md: { flexDirection: 'row', alignItems: 'flex-end', gap: 0 } }}>
        <div>
          <h1 className="section-title">Manage Pets</h1>
          <p className="section-sub" style={{ marginBottom: 0 }}>Create, update, and remove pet listings.</p>
        </div>
        
        <Link to="/admin/pets/new" className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
          + Add New Pet
        </Link>
      </div>

      <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flexGrow: 1, minWidth: '250px' }}>
          <input 
            type="text" 
            className="input" 
            placeholder="Search by name or breed..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit" className="btn-secondary">Search</button>
        </form>
        
        <select 
          className="select" 
          style={{ width: '200px' }}
          value={status}
          onChange={e => { setStatus(e.target.value); setCurrentPage(1); }}
        >
          <option value="">All Statuses</option>
          <option value="available">Available</option>
          <option value="pending">Pending</option>
          <option value="adopted">Adopted</option>
        </select>
      </div>

      {loading ? (
        <div style={{ padding: '10vh 0' }}><LoadingSpinner size="lg" /></div>
      ) : error ? (
        <div style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.875rem' }}>Pet Name</th>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.875rem' }}>Species / Breed</th>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.875rem' }}>Age</th>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.875rem' }}>Status</th>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.875rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pets.map(pet => (
                  <tr key={pet._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='var(--bg-hover)'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                    <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                        {pet.photo ? (
                          <img src={pet.photo.startsWith('http') ? pet.photo : `/api${pet.photo}`} alt={pet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>{pet.name[0]}</div>
                        )}
                      </div>
                      <Link to={`/pet/${pet._id}`} style={{ fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}>{pet.name}</Link>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                      {pet.species} <span style={{ color: 'var(--text-muted)' }}>•</span> {pet.breed}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{pet.age}y</td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`badge badge-${pet.status}`}>{pet.status}</span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <Link to={`/admin/pets/edit/${pet._id}`} className="btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                          Edit
                        </Link>
                        <button onClick={() => handleDelete(pet._id, pet.name)} className="btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pets.length === 0 && (
            <div style={{ padding: '3rem', borderTop: '1px solid var(--border)' }}>
              <EmptyState 
                type="pets"
                title="No pets found"
                description="No pets found matching your criteria."
              />
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'center', gap: '0.5rem', background: 'var(--bg-secondary)' }}>
              <button disabled={pagination.page === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>Prev</button>
              <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0 0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Page {pagination.page} of {pagination.pages}</span>
              <button disabled={pagination.page === pagination.pages} onClick={() => setCurrentPage(prev => prev + 1)} className="btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
