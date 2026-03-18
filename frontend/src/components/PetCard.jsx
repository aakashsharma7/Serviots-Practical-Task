import { memo } from 'react';
import { Link } from 'react-router-dom';

const PetCard = memo(function PetCard({ pet }) {
  const getInitials = (name) => name ? name[0].toUpperCase() : '?';
  
  const defaultBg = [
    'linear-gradient(135deg, #7c6ef7, #4a3eb3)',
    'linear-gradient(135deg, #22c55e, #16a34a)',
    'linear-gradient(135deg, #f59e0b, #d97706)',
    'linear-gradient(135deg, #ec4899, #be185d)'
  ];
  const bgIndex = pet.name ? pet.name.length % defaultBg.length : 0;

  return (
    <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ position: 'relative', height: 220, overflow: 'hidden', background: pet.photo ? '#000' : defaultBg[bgIndex], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {pet.photo ? (
          <img 
            src={pet.photo.startsWith('http') ? pet.photo : `/api${pet.photo}`} 
            alt={pet.name} 
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          />
        ) : (
          <span style={{ fontSize: '4rem', fontWeight: 800, color: 'rgba(255,255,255,0.5)' }}>{getInitials(pet.name)}</span>
        )}
        
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
          <span className={`badge badge-${pet.status}`}>
            {pet.status}
          </span>
        </div>
      </div>
      
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>{pet.name}</h3>
          <span style={{ fontSize: '1.25rem' }}>
            {pet.species === 'dog' ? '🐶' : pet.species === 'cat' ? '🐱' : pet.species === 'bird' ? '🦜' : pet.species === 'rabbit' ? '🐰' : '🐾'}
          </span>
        </div>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem', textTransform: 'capitalize' }}>
          {pet.breed} • {pet.age} yrs • {pet.gender}
        </p>
        
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {pet.description}
        </p>
        
        <Link to={`/pet/${pet._id}`} className="btn-secondary" style={{ width: '100%' }}>
          View Details
        </Link>
      </div>
    </div>
  );
});

export default PetCard;
