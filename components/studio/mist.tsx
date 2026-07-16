'use client';

/**
 * Mist — sección de respiro gris-azulada (patrón Suffo "Are you looking for–"):
 * titular asimétrico a la derecha, stack de fotos rotadas como polaroids
 * lanzadas sobre la mesa, búsqueda hacia el sitio real de Andrea.
 */

import { useState } from 'react';
import { listings } from '@/components/listings-data';
import { Reveal, Line, Fade } from './ui';

const SEARCH_BASE = 'https://andrealarsen.foxroach.com/';

export default function Mist() {
  const [i, setI] = useState(0);
  const stack = [listings[1], listings[3], listings[5]];
  const next = () => setI((v) => (v + 1) % stack.length);

  return (
    <section className="st st-mist-s st-section">
      <div className="st-wrap" style={{ position: 'relative' }}>
        {/* número fantasma */}
        <div aria-hidden style={{ position: 'absolute', right: 0, top: '-1rem', fontFamily: 'var(--grotesk)', fontWeight: 500, fontSize: 'clamp(8rem, 20vw, 18rem)', lineHeight: 1, color: 'rgba(255,255,255,0.16)', pointerEvents: 'none' }}>
          01
        </div>

        <div className="st-mist-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(300px, 460px)', gap: '3rem', alignItems: 'center' }}>
          <Reveal>
            <span className="st-eyebrow" style={{ color: '#3d4548' }}>Agents</span>
            <h2 className="st-h1" style={{ margin: '1rem 0 2.2rem' }}>
              <Line i={0}>Are you</Line>
              <Line i={1} style={{ paddingLeft: '0.7em' }}>looking</Line>
              <Line i={2} style={{ paddingLeft: '1.6em' }}>for<span className="st-dash">–</span></Line>
            </h2>
            <Fade i={3}>
              <form
                action={SEARCH_BASE}
                target="_blank"
                style={{ display: 'flex', gap: '0.6rem', maxWidth: 460 }}
                onSubmit={(e) => { e.preventDefault(); window.open(SEARCH_BASE, '_blank', 'noopener'); }}
              >
                <input
                  placeholder="Search location — PA, MD, FL…"
                  aria-label="Search location"
                  style={{ flex: 1, border: '1px solid rgba(35,41,44,0.4)', background: 'transparent', borderRadius: 999, padding: '0.9em 1.4em', fontFamily: 'var(--body)', fontSize: '0.9rem', color: '#23292c', outline: 'none' }}
                />
                <button type="submit" aria-label="Search" style={{ width: 48, height: 48, borderRadius: 999, border: '1px solid rgba(35,41,44,0.4)', background: '#23292c', color: '#fff', cursor: 'pointer', fontSize: '1rem' }}>
                  →
                </button>
              </form>
            </Fade>
            <Fade i={4}>
              <p className="st-body" style={{ marginTop: '2rem', color: '#3d4548' }}>
                A dedicated buyer&apos;s agent across three states — tell Andrea what home means to you,
                and she&apos;ll find the address that says it.
              </p>
            </Fade>
          </Reveal>

          {/* stack de cards rotadas */}
          <Reveal>
            <div style={{ position: 'relative', height: 420 }}>
              {stack.map((l, k) => {
                const pos = (k - i + stack.length) % stack.length;
                return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <figure key={l.title} style={{
                    position: 'absolute', inset: 0, margin: 0, borderRadius: 18, overflow: 'hidden',
                    background: '#fff', padding: 10, boxShadow: '0 30px 70px -28px rgba(20,25,28,.55)',
                    transform: `rotate(${(pos - 1) * 6}deg) translateY(${pos * 10}px) scale(${1 - pos * 0.04})`,
                    zIndex: 10 - pos, transition: 'transform 500ms var(--ease-o)',
                  }}>
                    <img src={l.thumbnail} alt={l.title} style={{ width: '100%', height: 'calc(100% - 46px)', objectFit: 'cover', borderRadius: 10 }} />
                    <figcaption style={{ fontFamily: 'var(--body)', fontSize: '0.82rem', padding: '0.8em 0.4em 0', color: '#23292c' }}>{l.title}</figcaption>
                  </figure>
                );
              })}
              <button onClick={next} aria-label="Next property" style={{ position: 'absolute', right: -10, bottom: -10, zIndex: 20, width: 54, height: 54, borderRadius: 999, border: 0, background: '#0d0d0d', color: '#fff', fontSize: '1.4rem', cursor: 'pointer', boxShadow: '0 14px 34px rgba(10,12,14,.4)' }}>
                +
              </button>
            </div>
          </Reveal>
        </div>
      </div>
      <style>{`@media (max-width: 900px){ .st-mist-grid{ grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}
