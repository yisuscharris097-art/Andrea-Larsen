'use client';

/**
 * /properties — búsqueda avanzada split-view (ref. "Real.est" adaptada al
 * design system): filtros a la izquierda, resultados al centro, Quick View
 * con shared element transition, y toggle a vista de mapa estilizado.
 */

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { properties, bySlug, type Property, type PropertyType } from '@/lib/properties';
import { QuickView, useQuickView } from '@/components/studio/quick-view';
import CursorFX from '@/components/studio/cursor-fx';
import Curtain from '@/components/studio/curtain';
import '../studio.css';

const EASE = [0.22, 1, 0.36, 1] as const;
const TYPES: { t: PropertyType; icon: string }[] = [
  { t: 'House', icon: '⌂' }, { t: 'Condo', icon: '▤' }, { t: 'Townhouse', icon: '▦' }, { t: 'Land', icon: '▱' },
];
const ROOMS = [1, 2, 3, 4];
const MAX_PRICE = 6000000;

export default function PropertiesPage() {
  const qv = useQuickView();
  const [types, setTypes] = useState<PropertyType[]>([]);
  const [price, setPrice] = useState(MAX_PRICE);
  const [rooms, setRooms] = useState(0);
  const [forSaleOnly, setForSaleOnly] = useState(false);
  const [mapView, setMapView] = useState(false);
  const [sort, setSort] = useState<'price' | 'newest'>('price');

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('property');
    if (slug) { const p = bySlug(slug); if (p) qv.show(p); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const results = useMemo(() => [...properties].sort((a, b) => sort === 'price' ? b.price - a.price : Number(b.mlsRef) - Number(a.mlsRef)).filter((p) =>
    (types.length === 0 || types.includes(p.type)) &&
    p.price <= price &&
    (rooms === 0 || (p.beds || 0) >= rooms) &&
    (!forSaleOnly || p.status === 'For Sale')
  ), [types, price, rooms, forSaleOnly, sort]);

  // FLIP: las cards se REORDENAN físicamente al filtrar/ordenar
  const cardRefs = useRef(new Map<string, HTMLElement>());
  const prevRects = useRef(new Map<string, DOMRect>());
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const prev = prevRects.current;
    cardRefs.current.forEach((el, slug) => {
      const now = el.getBoundingClientRect();
      const was = prev.get(slug);
      if (was && (Math.abs(was.top - now.top) > 4 || Math.abs(was.left - now.left) > 4)) {
        el.animate(
          [{ transform: `translate(${(was.left - now.left).toFixed(1)}px, ${(was.top - now.top).toFixed(1)}px)` }, { transform: 'translate(0, 0)' }],
          { duration: 520, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
        );
      } else if (!was) {
        el.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 380, easing: 'ease-out' });
      }
    });
    prev.clear();
    cardRefs.current.forEach((el, slug) => prev.set(slug, el.getBoundingClientRect()));
  }, [results]);

  const chips: { label: string; clear: () => void }[] = [
    ...types.map((t) => ({ label: t, clear: () => setTypes(types.filter((x) => x !== t)) })),
    ...(price < MAX_PRICE ? [{ label: `≤ $${(price / 1e6).toFixed(1)}M`, clear: () => setPrice(MAX_PRICE) }] : []),
    ...(rooms > 0 ? [{ label: `${rooms}+ rooms`, clear: () => setRooms(0) }] : []),
    ...(forSaleOnly ? [{ label: 'For Sale', clear: () => setForSaleOnly(false) }] : []),
  ];

  return (
    <main className="st st-light-s" style={{ minHeight: '100vh' }}>
      <CursorFX />
      <Curtain />
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem clamp(1.25rem, 4vw, 4rem)' }}>
        <Link href="/" className="st-pill st-pill--dark" data-curtain="Home">← Home</Link>
        <span className="st-eyebrow">Ocean City &amp; the Jersey Shore</span>
        <button className="st-pill st-pill--solid" onClick={() => setMapView(!mapView)} style={{ border: 0 }}>
          {mapView ? 'Change to list view' : 'Change to map view'}
        </button>
      </nav>

      <div className="props-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(230px, 290px) minmax(0, 1fr)', gap: '2.4rem', padding: '1rem clamp(1.25rem, 4vw, 4rem) 4rem', alignItems: 'start' }}>
        {/* ── filtros ── */}
        <aside style={{ position: 'sticky', top: '1.2rem', display: 'grid', gap: '1.8rem' }}>
          <div>
            <div className="st-eyebrow" style={{ marginBottom: '0.8rem' }}>Property type</div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {TYPES.map(({ t, icon }) => (
                <button key={t} onClick={() => setTypes(types.includes(t) ? types.filter((x) => x !== t) : [...types, t])}
                  className="st-pill st-pill--dark" style={types.includes(t) ? { background: 'var(--st-ink)', color: '#fff' } : {}}>
                  {icon} {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="st-eyebrow" style={{ marginBottom: '0.8rem' }}>Max price — <b style={{ color: 'var(--st-ink)' }}>${(price / 1e6).toFixed(2)}M</b></div>
            <input type="range" min={2000000} max={MAX_PRICE} step={100000} value={price} onChange={(e) => setPrice(+e.target.value)}
              aria-label="Maximum price" style={{ width: '100%', accentColor: '#8C6D2F' }} />
          </div>
          <div>
            <div className="st-eyebrow" style={{ marginBottom: '0.8rem' }}>Rooms</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {ROOMS.map((r) => (
                <button key={r} onClick={() => setRooms(rooms === r ? 0 : r)}
                  className="st-pill st-pill--dark" style={rooms === r ? { background: 'var(--st-ink)', color: '#fff' } : {}}>
                  {r}{r === 4 ? '+' : ''}
                </button>
              ))}
            </div>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={forSaleOnly} onChange={(e) => setForSaleOnly(e.target.checked)} style={{ accentColor: '#8C6D2F', width: 16, height: 16 }} />
            Active listings only
          </label>
          <p style={{ fontSize: '0.72rem', color: 'var(--st-grey)', lineHeight: 1.5 }}>
            ◌ Garage · Pool · Furnished filters activate when the IDX feed connects.
          </p>
        </aside>

        {/* ── resultados / mapa ── */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '1.4rem' }}>
            <h1 style={{ fontFamily: 'var(--grotesk)', fontWeight: 500, fontStretch: '115%', letterSpacing: '-0.02em', fontSize: '1.5rem', margin: 0 }}>
              Search results ({results.length})
            </h1>
            <select value={sort} onChange={(e) => setSort(e.target.value as 'price' | 'newest')} aria-label="Sort results"
              style={{ marginLeft: 'auto', border: '1px solid var(--st-line)', borderRadius: 999, padding: '0.5em 1.1em', fontFamily: 'var(--body)', fontSize: '0.8rem', background: '#fff', cursor: 'pointer' }}>
              <option value="price">Sort: Price</option>
              <option value="newest">Sort: Newest</option>
            </select>
            {chips.map((c) => (
              <button key={c.label} onClick={c.clear} className="st-pill st-pill--dark" style={{ fontSize: '0.72rem', padding: '0.4em 1em' }}>
                {c.label} ×
              </button>
            ))}
            {chips.length > 0 && (
              <button onClick={() => { setTypes([]); setPrice(MAX_PRICE); setRooms(0); setForSaleOnly(false); }}
                style={{ background: 'none', border: 0, color: '#8C6D2F', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500 }}>
                Clear all
              </button>
            )}
          </div>

          {mapView ? (
            /* mapa estilizado con pins */
            <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', background: '#E9EAE6', aspectRatio: '4/3' }}>
              <svg viewBox="0 0 640 480" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden>
                <rect width="640" height="480" fill="#EDEEEA" />
                <path d="M-20 430 C160 380 480 460 660 400 L660 500 L-20 500 Z" fill="#D7E4EA" />
                <g stroke="#D7D9D2" strokeWidth="8" fill="none">
                  <path d="M-20 120 C160 90 300 170 660 130" /><path d="M-20 300 C200 280 420 330 660 290" />
                  <path d="M120 -20 C140 160 90 320 130 500" /><path d="M380 -20 C360 180 420 340 390 500" />
                </g>
              </svg>
              {results.map((p) => (
                <button key={p.slug} onClick={() => qv.show(p)} aria-label={`${p.address} — ${p.priceDisplay}`}
                  className="st-pin" style={{ position: 'absolute', left: `${p.map.x}%`, top: `${p.map.y}%`, transform: 'translate(-50%, -100%)', background: '#4E2A4F', color: '#fff', border: 0, borderRadius: 999, padding: '0.4em 0.9em', fontSize: '0.74rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 10px 24px rgba(10,10,10,.3)', whiteSpace: 'nowrap', animationDelay: `${results.indexOf(p) * 70}ms` }}>
                  ${(p.price / 1e6).toFixed(1)}M
                </button>
              ))}
            </div>
          ) : (
            /* cards horizontales */
            <div style={{ display: 'grid', gap: '1.1rem' }}>
              {results.map((p) => (
                <button key={p.slug} onClick={() => qv.show(p)} aria-label={`Quick view of ${p.address}`} data-cursor="View →"
                  ref={(el) => { if (el) cardRefs.current.set(p.slug, el); else cardRefs.current.delete(p.slug); }}
                  style={{ display: 'grid', gridTemplateColumns: 'minmax(170px, 320px) 1fr auto', gap: '1.2rem', alignItems: 'center', background: '#fff', border: '1px solid var(--st-line)', borderRadius: 18, padding: '0.8rem', cursor: 'pointer', textAlign: 'left', font: 'inherit', color: 'inherit', opacity: p.status === 'Pending' ? 0.78 : 1 }}>
                  <motion.div layoutId={`ph-${p.slug}`} transition={{ duration: 0.5, ease: EASE }} style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', aspectRatio: '4/3' }}>
                    <Image src={p.photo} alt={p.address} fill sizes="240px" style={{ objectFit: 'cover' }} />
                  </motion.div>
                  <div>
                    <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--st-grey)', display: 'flex', alignItems: 'center', gap: '0.5em' }}>
                      <span aria-hidden style={{ width: 8, height: 8, borderRadius: 99, background: p.status === 'For Sale' ? '#3E7A44' : '#B8860B' }} />
                      {p.status} · {p.type}</div>
                    <div style={{ fontFamily: 'var(--grotesk)', fontWeight: 500, fontSize: '1.15rem', letterSpacing: '-0.02em', margin: '0.25rem 0' }}>{p.address}</div>
                    <div style={{ fontSize: '0.84rem', color: 'var(--st-grey)' }}>{p.city}, {p.state} {p.zip}</div>
                    <div style={{ display: 'flex', gap: '0.9em', fontSize: '0.8rem', color: '#555', marginTop: '0.5rem' }}>
                      {p.beds ? <span>{p.beds} Beds</span> : null}
                      {p.baths ? <span>{p.baths} Baths</span> : null}
                      {p.sqft ? <span>{p.sqft.toLocaleString('en-US')} sq ft</span> : null}
                      {p.lotAcres ? <span>{p.lotAcres} acres</span> : null}
                    </div>
                  </div>
                  <div style={{ fontFamily: 'var(--grotesk)', fontWeight: 500, fontVariantNumeric: 'tabular-nums', fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', letterSpacing: '-0.02em', paddingRight: '0.6rem' }}>
                    {p.priceDisplay}
                  </div>
                </button>
              ))}
              {results.length === 0 && (
                <p style={{ color: 'var(--st-grey)', padding: '3rem 0', textAlign: 'center' }}>No properties match those filters — try widening the search.</p>
              )}
            </div>
          )}
        </section>
      </div>

      <QuickView property={qv.open} onClose={qv.close} />

      <style>{`@media (max-width: 900px){ .props-grid{ grid-template-columns: 1fr !important; } .props-grid aside{ position: static !important; } }`}</style>
    </main>
  );
}
