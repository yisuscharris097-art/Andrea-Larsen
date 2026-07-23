'use client';

/**
 * Manifesto — statement full-bleed con el slogan de Andrea sobre una toma aérea
 * real de la costa. Parallax sutil (solo desktop), scrim de legibilidad, texto
 * editorial abajo a la izquierda. Reemplaza el TextClipScroll anterior.
 */

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Reveal, Line, Fade } from './ui';

const BG = '/oc/gal/210-gull-road/03.jpg';

export default function Manifesto() {
  const secRef = useRef<HTMLElement>(null);
  const parRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const mq = window.matchMedia('(min-width: 1024px)');
    let raf = 0;
    const loop = () => {
      const sec = secRef.current, par = parRef.current;
      if (sec && par) {
        if (mq.matches) {
          const r = sec.getBoundingClientRect();
          const off = r.top + r.height / 2 - window.innerHeight / 2;
          par.style.transform = `translateY(${(off * 0.14).toFixed(1)}px)`;
        } else {
          par.style.transform = '';
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section
      ref={secRef}
      aria-label="Helping you love where you live — the Larsen promise"
      style={{ position: 'relative', minHeight: '90svh', overflow: 'hidden', background: '#23292c', display: 'flex', alignItems: 'flex-end' }}
    >
      {/* foto con parallax */}
      <div ref={parRef} style={{ position: 'absolute', left: 0, right: 0, top: '-12%', height: '124%', willChange: 'transform' }}>
        <Image src={BG} alt="Ocean City, New Jersey — the Jersey Shore from above" fill priority sizes="100vw" style={{ objectFit: 'cover' }} />
      </div>
      {/* scrim de legibilidad (más denso abajo-izquierda) */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(12,15,17,0.72) 0%, rgba(12,15,17,0.28) 34%, rgba(12,15,17,0) 62%)' }} />
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(12,15,17,0.45) 0%, rgba(12,15,17,0) 55%)' }} />

      {/* texto editorial */}
      <div className="st-wrap" style={{ position: 'relative', width: '100%', padding: 'clamp(3rem, 8vh, 6rem) clamp(1.25rem, 5vw, 6.5rem)' }}>
        <Reveal>
          <span style={{ fontFamily: 'var(--body)', fontSize: '0.72rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.16em', color: 'rgba(255,255,255,0.82)', display: 'inline-flex', alignItems: 'center', gap: '0.6em' }}>
            <span aria-hidden style={{ fontSize: '0.5em' }}>●</span> The Larsen promise
          </span>

          <h2 style={{ margin: '1.3rem 0 0', maxWidth: '15ch', fontFamily: 'var(--grotesk)', fontWeight: 500, fontStretch: '115%', fontSize: 'clamp(2.6rem, 7vw, 6rem)', lineHeight: 0.98, letterSpacing: '-0.03em', color: '#FCFCFA', textShadow: '0 2px 40px rgba(8,10,12,0.5)' }}>
            <Line i={0}>Helping you love</Line>
            <Line i={1}>where you <span className="st-it">live.</span></Line>
          </h2>

          <Fade i={2}>
            <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1.4rem', flexWrap: 'wrap' }}>
              <a href="/about" className="st-pill" data-curtain="About">Meet Andrea →</a>
              <span style={{ fontFamily: 'var(--body)', fontSize: '0.72rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.7)' }}>
                Quality — Trust — Legacy
              </span>
            </div>
          </Fade>
        </Reveal>
      </div>
    </section>
  );
}
