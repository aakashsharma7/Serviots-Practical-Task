import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { petsAPI } from '../api';
import PetCard from '../components/PetCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [error, setError] = useState('');

  // Form State
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [species, setSpecies] = useState(searchParams.get('species') || '');
  const [size, setSize] = useState(searchParams.get('size') || '');
  const [minAge, setMinAge] = useState(searchParams.get('minAge') || '');
  const [maxAge, setMaxAge] = useState(searchParams.get('maxAge') || '');

  const fetchPets = async () => {
    setLoading(true);
    setError('');
    try {
      const params = Object.fromEntries([...searchParams]);
      // public view only available pets
      params.status = 'available';
      const { data } = await petsAPI.getAll(params);
      setPets(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError('Failed to fetch pets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [searchParams]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (species) params.set('species', species);
    if (size) params.set('size', size);
    if (minAge) params.set('minAge', minAge);
    if (maxAge) params.set('maxAge', maxAge);
    params.set('page', '1');
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearch('');
    setSpecies('');
    setSize('');
    setMinAge('');
    setMaxAge('');
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="page-container animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', background: 'linear-gradient(to right, #f0f0f8, var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>
          Find Your New Best Friend
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Browse our available pets and give a loving home to an animal in need.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', md: { flexDirection: 'row' } }}>
        {/* Sidebar Filters */}
        <div style={{ flex: '0 0 300px' }}>
          <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: '88px' }}>
            <h2 className="section-title" style={{ fontSize: '1.25rem' }}>Filters</h2>
            <form onSubmit={handleFilterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
              
              <div>
                <label className="label">Search</label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="Name or breed..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div>
                <label className="label">Species</label>
                <select className="select" value={species} onChange={(e) => setSpecies(e.target.value)}>
                  <option value="">All Species</option>
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="bird">Bird</option>
                  <option value="rabbit">Rabbit</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="label">Size</label>
                <select className="select" value={size} onChange={(e) => setSize(e.target.value)}>
                  <option value="">All Sizes</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="extra-large">Extra Large</option>
                </select>
              </div>

              <div>
                <label className="label">Age Range (years)</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="number" min="0" placeholder="Min" className="input" value={minAge} onChange={(e) => setMinAge(e.target.value)} />
                  <input type="number" min="0" placeholder="Max" className="input" value={maxAge} onChange={(e) => setMaxAge(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={clearFilters} className="btn-secondary" style={{ flex: 1 }}>Clear</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Apply</button>
              </div>
            </form>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flexGrow: 1 }}>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}

          {loading ? (
            <div style={{ padding: '4rem 0' }}>
              <LoadingSpinner size="lg" text="Finding pets..." />
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                Showing <strong style={{ color: 'var(--text-primary)' }}>{pagination.total}</strong> available pets
              </div>

              {pets.length === 0 ? (
                <EmptyState 
                  type="search"
                  title="No pets found"
                  description="Try adjusting your filters to see more results."
                  action={<button onClick={clearFilters} className="btn-secondary">Clear all filters</button>}
                />
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  {pets.map((pet) => (
                    <PetCard key={pet._id} pet={pet} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem', gap: '0.5rem' }}>
                  <button 
                    disabled={pagination.page === 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                    className="btn-secondary"
                    style={{ padding: '0.4rem 0.8rem' }}
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: pagination.pages }).map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={pagination.page === i + 1 ? "btn-primary" : "btn-secondary"}
                      style={{ padding: '0.4rem 0.8rem', minWidth: '40px' }}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button 
                    disabled={pagination.page === pagination.pages}
                    onClick={() => handlePageChange(pagination.page + 1)}
                    className="btn-secondary"
                    style={{ padding: '0.4rem 0.8rem' }}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
