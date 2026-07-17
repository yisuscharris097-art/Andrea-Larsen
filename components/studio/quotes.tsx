'use client';

/**
 * Quotes — carrusel horizontal con los principios reales de Andrea
 * (de su bio — no testimonios inventados). Drag físico + AUTOPLAY que se
 * pausa al interactuar + flechas prev/next. Respeta prefers-reduced-motion.
 */

import { useEffect, useRef } from 'react';
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
  const paused = useRef(false);

  const step = () => {
    const el = track.current;
    if (!el) return 0;
    const card = el.firstElementChild as HTMLElement | null;
    return card ? card.offsetWidth + 22 : 480;
  };

  const go = (dir: number) => {
    const el = track.current;
    if (!el) return;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 20;
    const atStart = el.scrollLeft <= 10;
    if (dir > 0 && atEnd) el.scrollTo({ left: 0, behavior: 'smooth' });
    else if (dir < 0 && atStart) el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
    else el.scrollBy({ left: dir * step(), behavior: 'smooth' });
  };

  // autoplay — pausa al hover/drag/pestaña oculta
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => {
      if (!paused.current && !document.hidden) go(1);
    }, 3600);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDown = (e: React.PointerEvent) => {
    const el = track.current!;
    drag.current = { down: true, x: e.clientX, left: el.scrollLeft };
    paused.current = true;
    el.setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current.down) return;
    track.current!.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
  };
  const onUp = () => { drag.current.down = false; };

  return (
    <section className="st st-mist-s st-section" style={{ overflow: 'hidden' }}>
      <div className="st-wrap">
        <Reveal>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <div>
              <span className="st-eyebrow" style={{ color: '#4a5457' }}>The Larsen standard</span>
              <h2 className="st-h2" style={{ margin: '1rem 0 0' }}>
                <Line i={0}>What working with</Line>
                <Line i={1}>Andrea <span className="st-it">feels</span> like<span className="st-dash">–</span></Line>
              </h2>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button onClick={() => { paused.current = true; go(-1); }} aria-label="Previous"
                style={{ width: 52, height: 52, borderRadius: 999, border: '1px solid rgba(35,41,44,0.4)', background: 'transparent', color: '#23292c', fontSize: '1.1rem', cursor: 'pointer', transition: 'background 250ms var(--ease), color 250ms var(--ease)' }}
                onMouseOver={(e) => { e.currentTarget.style.background = '#23292c'; e.currentTarget.style.color = '#fff'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#23292c'; }}>
                ←
              </button>
              <button onClick={() => { paused.current = true; go(1); }} aria-label="Next"
                style={{ width: 52, height: 52, borderRadius: 999, border: 0, background: '#0d0d0d', color: '#fff', fontSize: '1.1rem', cursor: 'pointer' }}>
                →
              </button>
            </div>
          </div>
        </Reveal>
      </div>
      <div
        ref={track}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={(e) => { onUp(); paused.current = false; }}
        onPointerEnter={() => { paused.current = true; }}
        data-cursor="Drag"
        style={{ display: 'flex', gap: '1.4rem', overflowX: 'auto', padding: '0 clamp(1.25rem, 5vw, 6.5rem) 0.5rem', cursor: 'grab', scrollbarWidth: 'none', userSelect: 'none' }}
      >
        {QUOTES.map((c, i) => (
          <blockquote key={i} style={{ flex: '0 0 min(480px, 82vw)', margin: 0, background: '#FCFCFA', border: '1px solid rgba(35,41,44,0.12)', borderRadius: 20, padding: '2.4rem 2.2rem 2.8rem', position: 'relative', overflow: 'hidden' }}>
            <span aria-hidden style={{ position: 'absolute', right: 8, bottom: -34, fontFamily: 'var(--grotesk)', fontWeight: 500, fontSize: '9rem', lineHeight: 1, color: 'rgba(35,41,44,0.07)' }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <p style={{ fontFamily: 'var(--grotesk)', fontWeight: 500, letterSpacing: '-0.02em', fontSize: 'clamp(1.5rem, 2.6vw, 2.1rem)', lineHeight: 1.1, margin: 0, color: '#4E2A4F' }}>
              “{c.q}”
            </p>
            <p style={{ color: '#5b666a', marginTop: '1.1rem', fontSize: '0.95rem' }}>{c.d}</p>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
