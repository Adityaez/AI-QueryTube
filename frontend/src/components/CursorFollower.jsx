import { useEffect, useRef, useState } from 'react'

/**
 * CursorFollower v2
 * ─────────────────
 * • Native system cursor stays fully visible
 * • A solid circular follower trails behind with lerp smoothing
 * • On hover over buttons / links / inputs / text:
 *     – Expands slightly
 *     – Transitions to glassmorphism (translucent + backdrop-blur)
 */
export default function CursorFollower() {
  const followerRef = useRef(null)
  const mouse       = useRef({ x: -300, y: -300 })
  const pos         = useRef({ x: -300, y: -300 })
  const rafId       = useRef(null)
  const [hovering, setHovering] = useState(false)

  // ── Track raw mouse ───────────────────────────────────
  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // ── Detect interactive hover targets ─────────────────
  useEffect(() => {
    const INTERACTIVE = 'button, a, input, textarea, select, [data-cursor="hover"], h1, h2, h3, label, p, span, li'

    const onOver = (e) => {
      if (e.target.closest(INTERACTIVE)) setHovering(true)
    }
    const onOut = (e) => {
      if (e.target.closest(INTERACTIVE)) setHovering(false)
    }

    window.addEventListener('mouseover', onOver)
    window.addEventListener('mouseout',  onOut)
    return () => {
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mouseout',  onOut)
    }
  }, [])

  // ── rAF lerp loop ─────────────────────────────────────
  useEffect(() => {
    const lerp = (a, b, t) => a + (b - a) * t
    const SPEED = 0.09   // lower = more lag / smoother trail

    const tick = () => {
      pos.current.x = lerp(pos.current.x, mouse.current.x, SPEED)
      pos.current.y = lerp(pos.current.y, mouse.current.y, SPEED)

      const el = followerRef.current
      if (el) {
        el.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`
      }
      rafId.current = requestAnimationFrame(tick)
    }
    rafId.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId.current)
  }, [])

  // ── Dynamic styles ────────────────────────────────────
  const SIZE_DEFAULT = 28
  const SIZE_HOVER   = 56

  const size   = hovering ? SIZE_HOVER   : SIZE_DEFAULT
  const offset = hovering ? SIZE_HOVER / 2 : SIZE_DEFAULT / 2

  const style = {
    // positioning
    position: 'fixed',
    top:  0,
    left: 0,
    marginTop:  -offset,
    marginLeft: -offset,
    width:  size,
    height: size,
    borderRadius: '50%',

    // glassmorphism (on hover) vs solid (default)
    background: hovering
      ? 'rgba(124, 111, 247, 0.18)'
      : 'rgba(124, 111, 247, 0.55)',

    backdropFilter:       hovering ? 'blur(8px) saturate(160%)' : 'none',
    WebkitBackdropFilter: hovering ? 'blur(8px) saturate(160%)' : 'none',

    border: hovering
      ? '1px solid rgba(255, 255, 255, 0.45)'
      : 'none',

    boxShadow: hovering
      ? '0 4px 24px rgba(124, 111, 247, 0.25), inset 0 1px 0 rgba(255,255,255,0.3)'
      : '0 2px 12px rgba(124, 111, 247, 0.35)',

    // smooth transitions between states
    transition: [
      'width 0.38s cubic-bezier(0.23, 1, 0.32, 1)',
      'height 0.38s cubic-bezier(0.23, 1, 0.32, 1)',
      'margin 0.38s cubic-bezier(0.23, 1, 0.32, 1)',
      'background 0.3s ease',
      'backdrop-filter 0.3s ease',
      'border 0.3s ease',
      'box-shadow 0.3s ease',
      'opacity 0.3s ease',
    ].join(', '),

    // layer above everything, never capture clicks
    zIndex:        99999,
    pointerEvents: 'none',
    willChange:    'transform',
  }

  return <div ref={followerRef} style={style} />
}
