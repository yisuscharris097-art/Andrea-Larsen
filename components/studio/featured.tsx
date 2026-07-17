'use client';

/**
 * Featured — grid editorial de listings REALES (Ocean City, NJ) con Quick View:
 * click en la foto → shared element transition al panel de detalle.
 * Deep-link: llegar con ?property=slug abre el Quick View directo.
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { properties, bySlug } from '@/lib/properties';
import { Reveal, Line, Fade } from './ui';
import { QuickView, useQuickView } from './quick-view';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Foto de card con mini-carrusel al hover (cicla las primeras 3 fotos, dots). */
function CardPhoto({ p }: { p: { slug: string; photo: string; photos: string[]; address: string; status: string; city: string } }) {
  const [k, setK] = useState(0);
  const trio = p.photos.slice(0, 3);
  return (
    <motion.div
      layoutId={`ph-${p.slug}`}
      transition={{ duration: 0.5, ease: EASE }}
      className="ph st-skel"
      onMouseEnter={() => trio.length > 1 && setK(1)}
      onMouseMove={(e) => {
        if (trio.length < 2) return;
        const r = e.currentTarget.getBoundingClientRect();
        setK(Math.min(trio.length - 1, Math.floor(((e.clientX - r.left) / r.width) * trio.length)));
      }}
      onMouseLeave={() => setK(0)}
    >
      {trio.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={src} src={src} alt={i === 0 ? p.address : ''} loading={i === 0 ? undefined : 'lazy'}
          style={{ position: i === 0 ? undefined : 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: i === k ? 1 : 0, transition: 'opacity 300ms var(--ease)', display: 'block' }} />
      ))}
      <span className="badge">{p.status}</span>
      <span className="badge" style={{ left: 'auto', right: 14, display: 'inline-flex', alignItems: 'center', gap: '0.35em' }}>
        <svg width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><path d="M10 18s-6-5.2-6-9.6A6 6 0 0110 2a6 6 0 016 6.4C16 12.8 10 18 10 18z" /><circle cx="10" cy="8" r="2" /></svg>
        {p.city}
      </span>
      {trio.length > 1 && (
        <span style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 5 }} aria-hidden>
          {trio.map((_, i) => (
            <span key={i} style={{ width: 6, height: 6, borderRadius: 99, background: i === k ? '#fff' : 'rgba(255,255,255,0.5)', transition: 'background 200ms' }} />
          ))}
        </span>
      )}
      <span className="arrow" aria-hidden>→</span>
    </motion.div>
  );
}

const Bed = () => (
  <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden><path d="M2 15V6m0 5h16v4M2 11V9h9v2m5-3h-3v3" /></svg>
);
const Bath = () => (
  <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden><path d="M3 10h14v2a4 4 0 01-4 4H7a4 4 0 01-4-4v-2zM5 10V4.5A1.5 1.5 0 016.5 3h1" /></svg>
);

export default function Featured() {
  const qv = useQuickView();
  const six = properties.slice(0, 12);

  // deep-link al montar
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('property');
    if (slug) { const p = bySlug(slug); if (p) qv.show(p); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="st st-light-s st-section" id="featured">
      <div className="st-wrap">
        <Reveal>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '3.4rem' }}>
            <div>
              <span className="st-eyebrow">Featured listings · Ocean City, NJ</span>
              <h2 className="st-h2" style={{ margin: '1rem 0 0' }}>
                <Line i={0}>Life at the</Line>
                <Line i={1}><span className="st-it">Jersey</span> Shore</Line>
              </h2>
            </div>
            <Fade i={2}>
              <a className="st-pill st-pill--solid" href="/properties">See all properties →</a>
            </Fade>
          </div>
        </Reveal>

        <Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2.4rem 1.8rem' }}>
            {six.map((p, i) => (
              <Fade key={p.slug} i={i % 3}>
                <button
                  className="st-card-l"
                  onClick={() => qv.show(p)}
                  aria-label={`Quick view of ${p.address}`}
                  style={{ background: 'none', border: 0, padding: 0, textAlign: 'left', width: '100%', cursor: 'pointer', font: 'inherit', color: 'inherit' }}
                >
                  <CardPhoto p={p} />
                  <div className="meta">
                    {p.beds ? (<span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4em' }}><Bed /> {p.beds} Beds</span>) : p.lotAcres ? (<span>{p.lotAcres} acres</span>) : (<span>{p.type === 'House' ? 'Multi-unit' : p.type}</span>)}
                    {p.baths ? (<><span aria-hidden>·</span><span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4em' }}><Bath /> {p.baths} Baths</span></>) : null}
                  </div>
                  <div className="name">{p.address}</div>
                  <div className="price-row">
                    <span className="price">{p.priceDisplay}</span>
                    <span className="addr">{p.city}, {p.state}</span>
                  </div>
                </button>
              </Fade>
            ))}
          </div>
        </Reveal>
      </div>

      <QuickView property={qv.open} onClose={qv.close} />
    </section>
  );
}
