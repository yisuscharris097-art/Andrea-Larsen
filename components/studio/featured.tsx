'use client';

/**
 * Featured — grid editorial de listings REALES (Ocean City, NJ) con Quick View:
 * click en la foto → shared element transition al panel de detalle.
 * Deep-link: llegar con ?property=slug abre el Quick View directo.
 */

import Image from 'next/image';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { properties, bySlug } from '@/lib/properties';
import { Reveal, Line, Fade } from './ui';
import { QuickView, useQuickView } from './quick-view';

const EASE = [0.22, 1, 0.36, 1] as const;

const Bed = () => (
  <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden><path d="M2 15V6m0 5h16v4M2 11V9h9v2m5-3h-3v3" /></svg>
);
const Bath = () => (
  <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden><path d="M3 10h14v2a4 4 0 01-4 4H7a4 4 0 01-4-4v-2zM5 10V4.5A1.5 1.5 0 016.5 3h1" /></svg>
);

export default function Featured() {
  const qv = useQuickView();
  const six = properties.slice(0, 6);

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
                  <motion.div layoutId={`ph-${p.slug}`} transition={{ duration: 0.5, ease: EASE }} className="ph">
                    <Image src={p.photo} alt={p.address} width={800} height={600} />
                    <span className="badge">{p.status}</span>
                    <span className="arrow" aria-hidden>→</span>
                  </motion.div>
                  <div className="meta">
                    {p.beds ? (<span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4em' }}><Bed /> {p.beds} Beds</span>) : (<span>{p.lotAcres} acres</span>)}
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
