'use client';

/**
 * Manifesto v2 — TextClipScroll (Awwwards Pack / Scroll 2, portado sin GSAP):
 * sección negra pineada donde "Quality –Trust Legacy" se RELLENA con el scroll
 * (clip-path por línea, izquierda → derecha; "–Trust" en dorado champagne).
 * Al completarse, entra la ficha técnica del flagship.
 */

import { useEffect, useRef, useState } from 'react';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

const LINES: { text: string; color: string; indent: string }[] = [
  { text: 'Quality', color: '#F4F4F2', indent: '0' },
  { text: '–Trust', color: '#E3C173', indent: '0.9em' },
  { text: 'Legacy', color: '#F4F4F2', indent: '0.35em' },
];

export default function Manifesto() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    let raf = 0;
    const tick = () => {
      const wrap = wrapRef.current;
      if (wrap) {
        const rect = wrap.getBoundingClientRect();
        const total = wrap.offsetHeight - window.innerHeight;
        const np = total > 0 ? clamp01(-rect.top / total) : 0;
        setP((prev) => (Math.abs(prev - np) > 0.003 ? np : prev));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const sheet = reduced ? 1 : seg(p, 0.74, 0.92);

  return (
    <div ref={wrapRef} className="st" style={{ position: 'relative', height: reduced ? 'auto' : '260vh', background: '#0d0d0d' }}>
      <section
        className="st-dark-s"
        aria-label="Quality, Trust, Legacy — the Larsen manifesto"
        style={{
          position: reduced ? 'relative' : 'sticky', top: 0, minHeight: '100svh',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: 'clamp(4rem, 9vh, 7rem) clamp(1.25rem, 5vw, 6.5rem)',
        }}
      >
        <div className="st-wrap" style={{ width: '100%' }}>
          <span className="st-eyebrow" style={{ color: '#8a8a8a' }}>The Larsen manifesto</span>

          <h2 style={{ margin: '1.6rem 0 0' }} aria-label="Quality, Trust, Legacy">
            {LINES.map((l, i) => {
              const fill = reduced ? 1 : seg(p, 0.06 + i * 0.22, 0.3 + i * 0.22);
              return (
                <span
                  key={l.text}
                  aria-hidden
                  style={{
                    display: 'block', position: 'relative', paddingLeft: l.indent,
                    fontFamily: 'var(--grotesk)', fontWeight: 500, fontStretch: '115%',
                    fontSize: 'clamp(3.4rem, 10vw, 9rem)', lineHeight: 1.02, letterSpacing: '-0.03em',
                  }}
                >
                  {/* base fantasma */}
                  <span style={{ color: 'rgba(244,244,242,0.13)' }}>{l.text}</span>
                  {/* relleno que avanza con el scroll */}
                  <span
                    style={{
                      position: 'absolute', inset: 0, paddingLeft: l.indent, color: l.color,
                      clipPath: `inset(-10% ${100 - fill * 100}% -10% 0)`,
                      willChange: 'clip-path',
                    }}
                  >
                    {l.text}
                  </span>
                </span>
              );
            })}
          </h2>

          {/* ficha técnica — entra cuando el manifesto terminó de llenarse */}
          <div style={{ opacity: sheet, transform: `translateY(${(1 - sheet) * 26}px)`, marginTop: '4rem' }}>
            <dl className="st-sheet">
              <div><dt>Property</dt><dd>Pineville Estate</dd></div>
              <div><dt>Location</dt><dd>Newtown, PA</dd></div>
              <div><dt>Price</dt><dd className="st-num">$18.8M</dd></div>
              <div><dt>Beds / Baths</dt><dd className="st-num">4 / 6</dd></div>
              <div><dt>Total area</dt><dd className="st-num">147.73 ac</dd></div>
            </dl>
            <p className="st-body" style={{ marginTop: '1.8rem' }}>
              From a family of top-producing agents and investors, Andrea builds every sale on the
              same three foundations — and the flagship listing carries all of them.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
