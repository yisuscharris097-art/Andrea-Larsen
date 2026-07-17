'use client';

/**
 * Marquee — banda infinita "OCEAN CITY — THE JERSEY SHORE — …" en grotesk
 * gigante con palabra en itálica serif. Velocidad y dirección reaccionan a la
 * velocidad del scroll (lerp). Se congela con prefers-reduced-motion.
 */

import { useEffect, useRef } from 'react';

const PHRASE = (
  <>
    Ocean City <span aria-hidden style={{ color: '#4E2A4F' }}>—</span> the <em className="st-it">Jersey</em> Shore{' '}
    <span aria-hidden style={{ color: '#4E2A4F' }}>—</span> Love Living Coast2Coast{' '}
    <span aria-hidden style={{ color: '#4E2A4F' }}>—</span>{' '}
  </>
);

export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = trackRef.current;
    if (!el) return;
    let x = 0, vel = 1, lastY = window.scrollY, raf = 0;
    const loop = () => {
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      const target = 1 + Math.min(6, Math.abs(dy) * 0.35) * Math.sign(dy || 1);
      vel += (target - vel) * 0.08;
      x -= vel * 0.9;
      const half = el.scrollWidth / 2;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      el.style.transform = `translateX(${x.toFixed(1)}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div aria-hidden style={{ overflow: 'hidden', padding: '2.6rem 0', borderTop: '1px solid var(--st-line)', borderBottom: '1px solid var(--st-line)', background: 'var(--st-bg)', whiteSpace: 'nowrap' }}>
      <div ref={trackRef} style={{ display: 'inline-block', whiteSpace: 'nowrap', willChange: 'transform', fontFamily: 'var(--grotesk)', fontWeight: 500, fontStretch: '115%', fontSize: 'clamp(2.4rem, 6vw, 5.2rem)', letterSpacing: '-0.02em', color: 'var(--st-ink)', textTransform: 'uppercase', lineHeight: 1 }}>
        <span>{PHRASE}{PHRASE}{PHRASE}</span>
        <span>{PHRASE}{PHRASE}{PHRASE}</span>
      </div>
    </div>
  );
}
