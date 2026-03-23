export default function LoadingSpinner() {
  const steps = ['Fetching results', 'Extracting transcripts', 'Ranking by meaning']

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '80px 0', gap: 28,
    }}>
      {/* Spinner */}
      <div style={{ position: 'relative', width: 52, height: 52 }}>
        {/* Track */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: '2.5px solid rgba(124,111,247,0.12)',
        }} />
        {/* Spinning arc */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: '2.5px solid transparent',
          borderTopColor: '#7c6ff7',
          borderRightColor: '#a89fef',
          animation: 'spin 0.9s linear infinite',
        }} />
        {/* Inner arc */}
        <div style={{
          position: 'absolute', inset: 8, borderRadius: '50%',
          border: '2px solid transparent',
          borderTopColor: 'rgba(124,111,247,0.35)',
          animation: 'spin 1.4s linear infinite reverse',
        }} />
        {/* Center dot */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          width: 8, height: 8,
          marginTop: -4, marginLeft: -4,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #7c6ff7, #a89fef)',
          boxShadow: '0 0 8px rgba(124,111,247,0.55)',
        }} />
      </div>

      {/* Text */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>
          Searching the best videos for you…
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, flexWrap: 'wrap' }}>
          {steps.map((step, i) => (
            <span
              key={step}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                fontSize: 12, color: 'var(--text-muted)',
                animation: `pulse-dot 1.5s ease-in-out ${i * 380}ms infinite`,
              }}
            >
              <span style={{
                width: 5, height: 5, borderRadius: '50%',
                background: 'var(--accent)', display: 'inline-block',
              }} />
              {step}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
