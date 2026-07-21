'use client';

/**
 * QuickView — detalle de listing sin salir de contexto.
 * Shared element transition: la foto de la card viaja físicamente al panel
 * (framer-motion layoutId). Desktop: panel lateral 65vw desde la derecha.
 * Mobile: bottom sheet con drag-to-close. Esc / × / click fuera cierran.
 * Deep-link: ?property=slug (router.replace, se puede compartir y abrir directo).
 */

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { agent } from '@/components/agent-data';
import type { Property } from '@/lib/properties';
import { Lightbox } from './lightbox';

const EASE = [0.22, 1, 0.36, 1] as const;

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45em', border: '1px solid var(--st-line)', borderRadius: 999, padding: '0.5em 1em', fontSize: '0.82rem', color: '#444', whiteSpace: 'nowrap' }}>
    {children}
  </span>
);

export function useQuickView() {
  const [open, setOpen] = useState<Property | null>(null);

  // deep-link: abrir/limpiar ?property=slug sin recargar
  const sync = useCallback((p: Property | null) => {
    const url = new URL(window.location.href);
    if (p) url.searchParams.set('property', p.slug);
    else url.searchParams.delete('property');
    window.history.replaceState(null, '', url.toString());
    setOpen(p);
  }, []);

  return { open, show: sync, close: () => sync(null) };
}

export function QuickView({ property, onClose }: { property: Property | null; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [more, setMore] = useState(false);
  const [lb, setLb] = useState<number | null>(null);

  useEffect(() => { setLb(null); setMore(false); }, [property?.slug]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 760px)');
    setIsMobile(mq.matches);
    const fn = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);

  // Esc + focus trap básico + scroll lock
  useEffect(() => {
    if (!property) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Lenis (home) intercepta la rueda a nivel documento: pausarlo mientras el
    // panel esté abierto para que solo deslice el QuickView, no la página.
    const lenis = (window as unknown as { __descentLenis?: { stop: () => void; start: () => void } }).__descentLenis;
    lenis?.stop();
    const t = setTimeout(() => panelRef.current?.focus(), 80);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      lenis?.start();
      clearTimeout(t);
    };
  }, [property, onClose]);

  return (
    <AnimatePresence>
      {property && (
        <motion.div
          key="qv-overlay"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(10,10,10,0.55)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
        >
          <motion.div
            key="qv-panel"
            ref={panelRef}
            role="dialog" aria-modal="true" aria-label={`${property.address} — quick view`}
            tabIndex={-1}
            data-lenis-prevent
            onClick={(e) => e.stopPropagation()}
            initial={isMobile ? { y: '100%' } : { x: '100%' }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: '100%' } : { x: '100%' }}
            transition={{ duration: 0.5, ease: EASE }}
            drag={isMobile ? 'y' : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => { if (info.offset.y > 120 || info.velocity.y > 600) onClose(); }}
            style={{
              position: 'absolute',
              ...(isMobile
                ? { left: 0, right: 0, bottom: 0, maxHeight: '92svh', borderRadius: '22px 22px 0 0' }
                : { top: 0, right: 0, bottom: 0, width: 'min(66vw, 980px)', borderRadius: '22px 0 0 22px' }),
              background: 'var(--st-bg)', overflowY: 'auto', outline: 'none',
              boxShadow: '-30px 0 90px rgba(8,8,8,.4)',
            }}
          >
            {/* handle (mobile) + close */}
            {isMobile && <div aria-hidden style={{ width: 44, height: 4, borderRadius: 4, background: '#d5d5d0', margin: '10px auto 0' }} />}
            <button
              onClick={onClose}
              aria-label="Close quick view"
              style={{ position: 'absolute', top: 16, right: 16, zIndex: 5, width: 42, height: 42, borderRadius: 999, border: '1px solid var(--st-line)', background: '#fff', fontSize: '1.1rem', cursor: 'pointer' }}
            >
              ×
            </button>

            {/* foto principal — llega volando desde la card (shared element) */}
            <motion.div layoutId={`ph-${property.slug}`} transition={{ duration: 0.5, ease: EASE }} className="st-skel" style={{ position: 'relative', aspectRatio: '16/10', margin: 'clamp(0.8rem, 2vw, 1.4rem)', borderRadius: 18, overflow: 'hidden', background: '#e2e2de', cursor: 'zoom-in' }} onClick={() => setLb(0)}>
              <Image src={property.photo} alt={property.address} fill sizes="(max-width: 760px) 100vw, 66vw" style={{ objectFit: 'cover' }} priority />
              <span style={{ position: 'absolute', top: 14, left: 14, background: '#fff', borderRadius: 999, padding: '0.45em 1em', fontSize: '0.74rem', fontWeight: 500 }}>{property.status}</span>
              <span style={{ position: 'absolute', bottom: 14, right: 14, background: 'rgba(13,13,13,0.6)', color: '#fff', backdropFilter: 'blur(8px)', borderRadius: 999, padding: '0.45em 1em', fontSize: '0.72rem' }}>
                {property.photos.length > 1 ? `View all ${property.photos.length} photos` : 'Full gallery on request'}
              </span>
            </motion.div>

            {/* thumbnails + badge +N */}
            {property.photos.length > 1 && (
              <div style={{ display: 'flex', gap: 8, padding: '0 clamp(0.8rem, 2vw, 1.4rem)', marginTop: -4 }}>
                {property.photos.slice(1, 5).map((p, k) => (
                  <button key={p} onClick={() => setLb(k + 1)} aria-label={`Open photo ${k + 2}`}
                    className="st-skel" style={{ flex: 1, aspectRatio: '4/3', maxWidth: '23%', borderRadius: 10, overflow: 'hidden', border: 0, padding: 0, cursor: 'pointer', background: '#e2e2de' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </button>
                ))}
                {property.photos.length > 5 && (
                  <button onClick={() => setLb(5)} aria-label={`View all ${property.photos.length} photos`}
                    style={{ flex: 1, aspectRatio: '4/3', maxWidth: '23%', borderRadius: 10, border: '1px solid var(--st-line)', background: '#fff', cursor: 'pointer', fontFamily: 'var(--grotesk)', fontWeight: 500, fontSize: '1.05rem' }}>
                    +{property.photos.length - 5}
                  </button>
                )}
              </div>
            )}

            <div style={{ padding: '0 clamp(1rem, 3vw, 2.2rem) 2.2rem' }}>
              {/* header: dirección + precio */}
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.8rem 2rem' }}>
                <div>
                  <span className="st-eyebrow">{property.city}, {property.state} · {property.type}</span>
                  <h2 style={{ fontFamily: 'var(--grotesk)', fontWeight: 500, fontStretch: '115%', letterSpacing: '-0.02em', fontSize: 'clamp(1.5rem, 3.2vw, 2.4rem)', margin: '0.5rem 0 0' }}>
                    {property.address}
                  </h2>
                </div>
                <div style={{ fontFamily: 'var(--grotesk)', fontWeight: 500, fontVariantNumeric: 'tabular-nums', fontSize: 'clamp(1.7rem, 4vw, 2.8rem)', letterSpacing: '-0.02em', marginLeft: 'auto' }}>
                  {property.priceDisplay}
                </div>
              </div>

              {/* chips de specs */}
              <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap', margin: '1.2rem 0' }}>
                {property.beds ? <Chip>🛏 {property.beds} Bedrooms</Chip> : null}
                {property.baths ? <Chip>🛁 {property.baths} Bathrooms</Chip> : null}
                {property.sqft ? <Chip>⬛ {property.sqft.toLocaleString('en-US')} sq ft</Chip> : null}
                {property.lotAcres ? <Chip>🌿 {property.lotAcres} acres</Chip> : null}
              </div>

              {/* features */}
              <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap', marginBottom: '1.4rem' }}>
                {property.features.map((f) => (
                  <span key={f} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4em', background: '#fff', borderRadius: 999, padding: '0.5em 1em', fontSize: '0.8rem', border: '1px solid var(--st-line)' }}>
                    <span style={{ color: '#8C6D2F' }}>✓</span> {f}
                  </span>
                ))}
              </div>

              {/* descripción 3 líneas + read more */}
              <p style={{ color: '#555', lineHeight: 1.6, maxWidth: '62ch', margin: 0, display: '-webkit-box', WebkitLineClamp: more ? undefined : 3, WebkitBoxOrient: 'vertical', overflow: more ? 'visible' : 'hidden' }}>
                {property.description}
              </p>
              <button onClick={() => setMore(!more)} style={{ background: 'none', border: 0, padding: 0, marginTop: 6, color: '#8C6D2F', fontWeight: 500, cursor: 'pointer', fontSize: '0.86rem' }}>
                {more ? 'Read less' : 'Read more'}
              </button>

              {/* card de Andrea */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', border: '1px solid var(--st-line)', borderRadius: 18, padding: '1rem 1.2rem', margin: '1.6rem 0' }}>
                <Image src={agent.photo} alt={agent.name} width={52} height={52} style={{ borderRadius: 999, objectFit: 'cover', width: 52, height: 52 }} />
                <div style={{ minWidth: 140 }}>
                  <div style={{ fontFamily: 'var(--grotesk)', fontWeight: 500 }}>{agent.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--st-grey)' }}>{agent.rank} · ★ Top producer</div>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', marginLeft: 'auto', flexWrap: 'wrap' }}>
                  <a className="st-pill st-pill--solid" href={`tel:${agent.office.phone.replace(/[^\d]/g, '')}`}>Contact</a>
                  <a className="st-pill st-pill--dark" href={`https://wa.me/1${agent.contact.phone.replace(/[^\d]/g, '')}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                </div>
              </div>

              <Link href={`/listing/${property.slug}`} className="st-pill st-pill--solid" style={{ width: '100%', justifyContent: 'center', padding: '1em' }}>
                View full details →
              </Link>
            </div>

            <Lightbox photos={property.photos} alt={`${property.address}, ${property.city}`} index={lb} onClose={() => setLb(null)} onIndex={setLb} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
