export default function LoadingSpinner({ size = 'md', text = '' }) {
  const sizes = { sm: 20, md: 36, lg: 56 };
  const s = sizes[size] || 36;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '2rem' }}>
      <svg
        width={s}
        height={s}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ animation: 'spin 1s linear infinite' }}
      >
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        <circle cx="12" cy="12" r="10" stroke="var(--border)" strokeWidth="3" />
        <path d="M12 2a10 10 0 0 1 10 10" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
      </svg>
      {text && <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{text}</p>}
    </div>
  );
}
