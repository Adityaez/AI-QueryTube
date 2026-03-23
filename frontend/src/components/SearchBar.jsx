import { useState } from 'react'

export default function SearchBar({ onSearch, loading }) {
  const [topic,    setTopic]    = useState('')
  const [question, setQuestion] = useState('')
  const [errors,   setErrors]   = useState({})

  const validate = () => {
    const e = {}
    if (!topic.trim())    e.topic    = 'Topic is required'
    if (!question.trim()) e.question = 'Question is required'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length > 0) { setErrors(e2); return }
    setErrors({})
    onSearch({ topic: topic.trim(), question: question.trim() })
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Topic field */}
        <div>
          <label style={{
            display: 'block', fontSize: 13, fontWeight: 600,
            color: 'var(--text-secondary)', marginBottom: 7, letterSpacing: '0.01em',
          }}>
            YouTube Topic
          </label>
          <input
            id="topic-input"
            className={`input-field${errors.topic ? ' error' : ''}`}
            style={{ padding: '12px 16px' }}
            type="text"
            placeholder="e.g. FastAPI tutorial"
            value={topic}
            onChange={e => { setTopic(e.target.value); setErrors(p => ({ ...p, topic: '' })) }}
            disabled={loading}
          />
          {errors.topic && (
            <p style={{ marginTop: 5, fontSize: 12, color: '#f87171' }}>{errors.topic}</p>
          )}
        </div>

        {/* Question field */}
        <div>
          <label style={{
            display: 'block', fontSize: 13, fontWeight: 600,
            color: 'var(--text-secondary)', marginBottom: 7, letterSpacing: '0.01em',
          }}>
            Your Question
          </label>
          <textarea
            id="question-input"
            className={`input-field${errors.question ? ' error' : ''}`}
            style={{ padding: '12px 16px', resize: 'none' }}
            rows={3}
            placeholder="e.g. How to deploy an ML model with FastAPI?"
            value={question}
            onChange={e => { setQuestion(e.target.value); setErrors(p => ({ ...p, question: '' })) }}
            disabled={loading}
          />
          {errors.question && (
            <p style={{ marginTop: 5, fontSize: 12, color: '#f87171' }}>{errors.question}</p>
          )}
        </div>

        {/* Submit button */}
        <button
          id="search-btn"
          type="submit"
          className="btn-primary"
          style={{ width: '100%', padding: '13px 24px' }}
          disabled={loading}
        >
          {loading ? (
            <>
              <svg style={{ width: 18, height: 18, flexShrink: 0, animation: 'spin 0.9s linear infinite' }}
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.25)" strokeWidth="4" />
                <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Analyzing…
            </>
          ) : (
            <>
              <svg style={{ width: 18, height: 18, flexShrink: 0 }}
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search with AI
            </>
          )}
        </button>

      </div>
    </form>
  )
}
