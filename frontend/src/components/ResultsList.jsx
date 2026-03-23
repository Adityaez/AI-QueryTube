import VideoCard from './VideoCard'

export default function ResultsList({ results }) {
  if (!results || results.length === 0) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '80px 0', textAlign: 'center',
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 18,
          background: 'var(--bg-subtle)',
          border: '1.5px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 18,
        }}>
          <svg width="26" height="26" fill="none" stroke="var(--text-muted)" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
          No results found
        </p>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Try adjusting your topic or question
        </p>
      </div>
    )
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: 18,
      paddingBottom: 60,
    }}>
      {results.map((video, index) => (
        <div
          key={video.video_id}
          style={{
            animation: 'fadeSlideUp 0.4s ease both',
            animationDelay: `${index * 65}ms`,
          }}
        >
          <VideoCard
            title={video.title}
            videoId={video.video_id}
            rank={index + 1}
            similarityScore={video.similarity_score}
          />
        </div>
      ))}
    </div>
  )
}
