import React from 'react';

const EmptyState = ({ type = 'search', title, description, action }) => {
  // We'll create some highly styled, abstract SVG illustrations
  const Illustration = () => {
    switch (type) {
      case 'pets':
        return (
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
            <circle cx="100" cy="100" r="80" fill="var(--bg-secondary)" />
            <path d="M70 110C70 93.4315 83.4315 80 100 80C116.569 80 130 93.4315 130 110V130H70V110Z" fill="var(--accent)" fillOpacity="0.2" stroke="var(--accent)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
             <path d="M100 80V65" stroke="var(--accent)" strokeWidth="6" strokeLinecap="round"/>
            <path d="M85 70L75 60" stroke="var(--accent)" strokeWidth="6" strokeLinecap="round"/>
            <path d="M115 70L125 60" stroke="var(--accent)" strokeWidth="6" strokeLinecap="round"/>
            <circle cx="90" cy="110" r="5" fill="var(--accent)"/>
            <circle cx="110" cy="110" r="5" fill="var(--accent)"/>
            <path d="M95 120C95 120 98 125 100 125C102 125 105 120 105 120" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round"/>
          </svg>
        );
      case 'applications':
        return (
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
             <path d="M40 70C40 58.9543 48.9543 50 60 50H140C151.046 50 160 58.9543 160 70V150C160 161.046 151.046 170 140 170H60C48.9543 170 40 161.046 40 150V70Z" fill="var(--bg-secondary)"/>
            <path d="M60 50L100 85L140 50" stroke="var(--accent)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="40" y="50" width="120" height="120" rx="20" stroke="var(--accent)" strokeWidth="8" strokeOpacity="0.5"/>
            <circle cx="140" cy="150" r="25" fill="var(--bg-root)"/>
            <path d="M130 150L137 157L150 144" stroke="var(--accent)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'search':
      default:
        return (
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
            <circle cx="90" cy="90" r="70" fill="var(--bg-secondary)"/>
            <circle cx="90" cy="90" r="40" stroke="var(--accent)" strokeWidth="8" strokeOpacity="0.5"/>
            <path d="M120 120L155 155" stroke="var(--accent)" strokeWidth="12" strokeLinecap="round"/>
            <path d="M80 80C80 80 85 75 90 75C95 75 100 80 100 80" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round"/>
            <circle cx="80" cy="90" r="4" fill="var(--accent)"/>
            <circle cx="100" cy="90" r="4" fill="var(--accent)"/>
          </svg>
        );
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 2rem',
      textAlign: 'center',
      background: 'var(--bg-secondary)',
      borderRadius: '1rem',
      border: '1px solid var(--border)',
      maxWidth: '600px',
      margin: '0 auto',
      boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)'
    }} className="animate-fade-in">
      <div style={{ width: '160px', height: '160px', marginBottom: '1.5rem', animation: 'float 6s ease-in-out infinite' }}>
        <Illustration />
      </div>
      <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6', marginBottom: action ? '2rem' : '0', maxWidth: '400px' }}>
        {description}
      </p>
      {action && (
        <div>{action}</div>
      )}

      {/* Inject float animation if not already injected */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.02); }
          100% { transform: translateY(0px) scale(1); }
        }
      `}} />
    </div>
  );
};

export default EmptyState;
