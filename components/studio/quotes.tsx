'use client';

/**
 * Quotes — carrusel horizontal drag con los principios reales de Andrea
 * (tomados de su bio — no testimonios inventados).
 */

import { useRef } from 'react';
import { Reveal, Line } from './ui';

const QUOTES = [
  { q: 'Meticulous attention to detail.', d: 'Every listing prepared like the only one.' },
  { q: 'Clear, honest communication.', d: 'You always know where your sale stands.' },
  { q: 'Strong negotiation.', d: 'Decades of closing at the right number.' },
  { q: 'Family and faith first.', d: 'The values behind every relationship she builds.' },
  { q: 'A family of top producers.', d: 'Market understanding, inherited and earned.' },
];

export default function Quotes() {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, x: 0, left: 0 });

  const onDown = (e: React.PointerEvent) => {
    const el = track.current!;
    drag.current = { down: true, x: e.clientX, left: el.scrollLeft };
    el.setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current.down) return;
    track.current!.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
  };
  const onUp = () => { drag.current.down = false; };

  return (
    <section className="st st-dark-s st-section" style={{ overflow: 'hidden' }}>
      <div className="st-wrap">
        <Reveal>
          <span className="st-eyebrow" style={{ color: '#8a8a8a' }}>The Larsen standard</span>
          <h2 className="st-h2" style={{ margin: '1rem 0 3rem' }}>
            <Line i={0}>What working with</Line>
            <Line i={1}>Andrea <span className="st-it">feels</span> like<span className="st-dash">–</span></Line>
          </h2>
        </Reveal>
      </div>
      <div
        ref={track}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        style={{ display: 'flex', gap: '1.4rem', overflowX: 'auto', padding: '0 clamp(1.25rem, 5vw, 6.5rem) 0.5rem', cursor: 'grab', scrollbarWidth: 'none', userSelect: 'none' }}
      >
        {QUOTES.map((c, i) => (
          <blockquote key={i} style={{ flex: '0 0 min(480px, 82vw)', margin: 0, background: 'var(--st-card)', border: '1px solid var(--st-line-dark)', borderRadius: 20, padding: '2.4rem 2.2rem 2.8rem', position: 'relative', overflow: 'hidden' }}>
            <span aria-hidden style={{ position: 'absolute', right: 8, bottom: -34, fontFamily: 'var(--grotesk)', fontWeight: 500, fontSize: '9rem', lineHeight: 1, color: 'rgba(244,244,242,0.06)' }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <p style={{ fontFamily: 'var(--grotesk)', fontWeight: 500, letterSpacing: '-0.02em', fontSize: 'clamp(1.5rem, 2.6vw, 2.1rem)', lineHeight: 1.1, margin: 0 }}>
              “{c.q}”
            </p>
            <p style={{ color: 'var(--st-grey-dark)', marginTop: '1.1rem', fontSize: '0.95rem' }}>{c.d}</p>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
