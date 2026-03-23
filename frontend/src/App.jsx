import { useState } from 'react'
import axios from 'axios'
import './App.css'

import SearchBar from './components/SearchBar'
import ResultsList from './components/ResultsList'
import LoadingSpinner from './components/LoadingSpinner'
import CursorFollower from './components/CursorFollower'

const API_BASE = 'http://localhost:8000'

// Decorative SVG blobs for the background (like the Dribbble reference)
function BgBlobs() {
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {/* Top-left plant blob */}
      <svg style={{ position: 'absolute', left: -60, top: 80, opacity: 0.18, width: 220 }}
        viewBox="0 0 200 300" fill="none">
        <ellipse cx="80" cy="160" rx="75" ry="110" fill="#c4bef7" />
        <ellipse cx="50" cy="80"  rx="38" ry="60"  fill="#b0a8f0" />
        <ellipse cx="110" cy="60" rx="28" ry="42"  fill="#c4bef7" />
      </svg>
      {/* Bottom-left leaf */}
      <svg style={{ position: 'absolute', left: 20, bottom: 60, opacity: 0.13, width: 100 }}
        viewBox="0 0 100 180" fill="none">
        <ellipse cx="50" cy="90" rx="40" ry="80" fill="#a89fef" />
      </svg>
      {/* Right-side tree */}
      <svg style={{ position: 'absolute', right: -30, bottom: 0, opacity: 0.13, width: 200 }}
        viewBox="0 0 200 320" fill="none">
        <rect x="88" y="200" width="24" height="120" rx="12" fill="#b0a8f0" />
        <ellipse cx="100" cy="160" rx="80" ry="90" fill="#c4bef7" />
        <ellipse cx="60"  cy="130" rx="44" ry="55" fill="#b0a8f0" />
        <ellipse cx="140" cy="120" rx="36" ry="50" fill="#c4bef7" />
      </svg>
      {/* Top-right faint circle */}
      <div style={{
        position: 'absolute', top: -80, right: -80,
        width: 320, height: 320, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(180,170,245,0.25) 0%, transparent 70%)',
      }} />
    </div>
  )
}

export default function App() {
  const [results, setResults]     = useState([])
  const [loading, setLoading]     = useState(false)
  const [searched, setSearched]   = useState(false)
  const [queryInfo, setQueryInfo] = useState(null)
  const [error, setError]         = useState(null)

  const handleSearch = async ({ topic, question }) => {
    setLoading(true)
    setResults([])
    setSearched(true)
    setError(null)
    setQueryInfo({ topic, question })

    try {
      const response = await axios.post(`${API_BASE}/search`, { topic, question })
      setResults(response.data.results ?? response.data)
    } catch (err) {
      console.error('Search failed:', err)
      setError('Something went wrong. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', position: 'relative' }}>
      <CursorFollower />
      <BgBlobs />

      {/* ── Navbar ───────────────────────────────────── */}
      <nav style={{
        position: 'relative', zIndex: 10,
        background: 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          maxWidth: 900, margin: '0 auto', padding: '0 28px',
          height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: 'linear-gradient(135deg, #7c6ff7, #a89fef)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {/* leaf icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.5 2 2 6.5 2 12c0 2.5 1 4.8 2.6 6.5C6 14 9.5 11 14 10.5c-3 2-5 5-5.5 8.5C10 20.3 11 20.5 12 20.5c5.5 0 10-4.5 10-10S17.5 2 12 2z"
                  fill="white" />
              </svg>
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              AI QueryTube
            </span>
          </div>

          {/* Status pill */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '5px 12px', borderRadius: 'var(--radius-full)',
            background: 'rgba(124,111,247,0.08)', border: '1px solid var(--border)',
          }}>
            <div style={{
              width: 7, height: 7, borderRadius: '50%',
              background: '#4ade80',
              boxShadow: '0 0 6px #4ade80',
              animation: 'pulse-dot 2s ease-in-out infinite',
            }} />
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>AI Ready</span>
          </div>
        </div>
      </nav>

      {/* ── Main ─────────────────────────────────────── */}
      <main style={{ position: 'relative', zIndex: 10, maxWidth: 860, margin: '0 auto', padding: '0 28px' }}>

        {/* ── Hero ─────────────────────────────────── */}
        <div style={{ paddingTop: 64, paddingBottom: 40, textAlign: 'center' }}>
          {/* Eyebrow */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 22,
            padding: '6px 16px', borderRadius: 'var(--radius-full)',
            background: 'var(--accent-light)', border: '1px solid var(--border)',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="var(--accent)" />
            </svg>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--accent)', letterSpacing: '0.02em' }}>
              Powered by SentenceTransformers
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.035em',
            lineHeight: 1.1,
            marginBottom: 18,
            color: 'var(--text-primary)',
          }}>
            Search YouTube
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #7c6ff7 0%, #a89fef 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              by Meaning, not Keywords
            </span>
          </h1>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: 420, margin: '0 auto', lineHeight: 1.65 }}>
            Ask a question. Our AI finds the most semantically relevant YouTube videos for your topic.
          </p>
        </div>

        {/* ── Search card ──────────────────────────── */}
        <div style={{
          background: 'var(--bg-surface)',
          borderRadius: 20,
          border: '1.5px solid var(--border)',
          boxShadow: 'var(--shadow-md)',
          padding: '28px 32px',
          marginBottom: 36,
        }}>
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>

        {/* ── Suggestion chips (pre-search) ───────── */}
        {!searched && (
          <div style={{ textAlign: 'center', paddingBottom: 32 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>
              Try a search
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
              {['Python machine learning', 'React hooks tutorial', 'System design basics', 'Docker for beginners'].map(s => (
                <span key={s} className="chip">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* ── Results area ─────────────────────────── */}
        {searched && (
          <div>
            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <div style={{
                textAlign: 'center', padding: '48px 0',
                color: '#f87171', fontSize: 14,
              }}>{error}</div>
            ) : (
              <>
                {results.length > 0 && (
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: 20,
                  }}>
                    <div>
                      <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                        Showing{' '}
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{results.length} results</span>
                        {' '}for{' '}
                        <span style={{ color: 'var(--accent)', fontWeight: 600 }}>"{queryInfo?.topic}"</span>
                      </p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
                        Ranked by semantic similarity to your question
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)' }}>
                      <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Semantic match
                    </div>
                  </div>
                )}
                <ResultsList results={results} />
              </>
            )}
          </div>
        )}
      </main>

      {/* ── Footer ───────────────────────────────────── */}
      <footer style={{
        position: 'relative', zIndex: 10, marginTop: 80,
        borderTop: '1px solid var(--border)', padding: '24px 0',
      }}>
        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
          AI QueryTube · Semantic search via <code style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>all-MiniLM-L6-v2</code>
        </p>
      </footer>
    </div>
  )
}
