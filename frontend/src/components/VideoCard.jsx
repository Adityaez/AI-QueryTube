import { useState } from 'react'

const scoreStyle = (score) => {
  if (score >= 0.85) return { color: '#22c55e', bg: 'rgba(34,197,94,0.10)',  border: 'rgba(34,197,94,0.25)' }
  if (score >= 0.70) return { color: '#7c6ff7', bg: 'rgba(124,111,247,0.10)', border: 'rgba(124,111,247,0.25)' }
  return               { color: '#8b87b8', bg: 'rgba(139,135,184,0.10)', border: 'rgba(139,135,184,0.20)' }
}

export default function VideoCard({ title, videoId, rank, similarityScore }) {
  const [showPlayer, setShowPlayer] = useState(false)
  const colors = scoreStyle(similarityScore ?? 0)
  const pct    = similarityScore ? Math.round(similarityScore * 100) : null

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1.5px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-sm)',
        transition: 'transform 0.22s, box-shadow 0.22s',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
      }}
    >
      {/* ── Thumbnail / Embed ─────────────────────── */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#e8e7f5', flexShrink: 0 }}>
        {showPlayer ? (
          <iframe
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div style={{ position: 'relative', width: '100%', height: '100%', cursor: 'pointer' }}
            onClick={() => setShowPlayer(true)}>
            <img
              src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
              alt={title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                transition: 'transform 0.4s', }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            />

            {/* Soft overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(45,43,85,0.35) 0%, transparent 60%)',
            }} />

            {/* Play button */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'rgba(255,255,255,0.93)',
                boxShadow: '0 4px 20px rgba(100,90,200,0.30)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'transform 0.18s, box-shadow 0.18s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(100,90,200,0.40)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)';   e.currentTarget.style.boxShadow = '0 4px 20px rgba(100,90,200,0.30)' }}
              >
                <svg width="18" height="18" fill="var(--accent)" viewBox="0 0 24 24" style={{ marginLeft: 2 }}>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>

            {/* Rank badge */}
            <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
              <span style={{
                fontSize: 11, fontWeight: 700,
                padding: '3px 9px', borderRadius: 'var(--radius-full)',
                background: rank === 1
                  ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                  : 'rgba(255,255,255,0.85)',
                color: rank === 1 ? '#fff' : 'var(--text-secondary)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                backdropFilter: 'blur(6px)',
              }}>
                {rank === 1 ? '🥇 Top Match' : `#${rank}`}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Card body ─────────────────────────────── */}
      <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <h3 style={{
          fontSize: 13.5, fontWeight: 600, lineHeight: 1.45,
          color: 'var(--text-primary)',
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
          flex: 1,
        }}>
          {title}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Score badge */}
          {pct !== null && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '4px 10px', borderRadius: 'var(--radius-full)',
              background: colors.bg, border: `1px solid ${colors.border}`,
              fontSize: 11.5, fontWeight: 600, color: colors.color,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors.color }} />
              {pct}% match
            </div>
          )}

          {/* Watch link */}
          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 12, fontWeight: 500,
              color: 'var(--text-muted)',
              textDecoration: 'none',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 6v2H5v11h11v-5h2v6a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1h6zm11-3v8h-2V6.413l-7.293 7.294-1.414-1.414L17.585 5H13V3h8z" />
            </svg>
            Watch
          </a>
        </div>
      </div>
    </div>
  )
}
