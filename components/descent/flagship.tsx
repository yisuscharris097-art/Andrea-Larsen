'use client';

/**
 * Flagship — 71 Morningside Road en marco blanco: slider horizontal con
 * crossfade detrás del titular FIJO "MORNINGSIDE ROAD", specs line, gradiente
 * de legibilidad, CTA ghost dentro del marco, parallax sutil (solo desktop)
 * y badge 3D TOUR listo para activar. Datos reales de lib/properties.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { bySlug } from '@/lib/properties';

const FONT = "var(--font-grotesk), 'Archivo', system-ui, sans-serif";
const SLUG = '71-morningside-road';
const DETAIL = `/listing/${SLUG}`;
const AUTOPLAY_MS = 5000;

export default function Flagship({ has3DTour = false }: { has3DTour?: boolean }) {
  const p = bySlug(SLUG);
  const photos = (p?.photos || []).slice(0, 6);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const parRef = useRef<HTMLDivElement>(null);

  const go = useCallback((n: number) => setIdx((i) => (i + n + photos.length) % photos.length), [photos.length]);

  useEffect(() => { setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches); }, []);

  // autoplay 5s — pausa en hover/focus, pestaña oculta y reduced motion
  useEffect(() => {
    if (reduced || paused || photos.length < 2) return;
    const id = setInterval(() => { if (!document.hidden) go(1); }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [reduced, paused, go, photos.length]);

  // parallax sutil: la imagen se mueve 15% más lento (solo ≥1024px, sin reduced)
  useEffect(() => {
    if (reduced) return;
    const mq = window.matchMedia('(min-width: 1024px)');
    let raf = 0;
    const loop = () => {
      const frame = frameRef.current, par = parRef.current;
      if (frame && par) {
        if (mq.matches) {
          const r = frame.getBoundingClientRect();
          const off = r.top + r.height / 2 - window.innerHeight / 2;
          par.style.transform = `translateY(${(off * 0.15).toFixed(1)}px)`;
        } else {
          par.style.transform = '';
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  if (!p || photos.length === 0) return null;

  const specs = [
    p.beds && `${p.beds} BEDS`,
    p.baths && `${p.baths} BATHS`,
    p.sqft && `${p.sqft.toLocaleString('en-US')} SQ FT`,
    p.priceDisplay,
  ].filter(Boolean) as string[];

  return (
    <section aria-label="The flagship listing — 71 Morningside Road, Ocean City NJ" className="fs-section">
      <div className="fs-eyebrow" aria-hidden>● The flagship listing · For sale</div>

      <div
        ref={frameRef}
        className="fs-frame"
        role="group"
        aria-roledescription="carousel"
        aria-label={`Photos of ${p.address}, ${p.city}`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false); }}
      >
        {/* fotos — crossfade 0.8s, con parallax en desktop */}
        <div ref={parRef} className="fs-par" aria-hidden={false}>
          {photos.map((src, i) => (
            <div key={src} className={`fs-slide${i === idx ? ' on' : ''}`} aria-hidden={i !== idx}>
              <Image
                src={src}
                alt={i === 0 ? `${p.address}, ${p.city} ${p.state} — flagship listing` : ''}
                fill
                sizes="(max-width: 900px) 100vw, 1400px"
                style={{ objectFit: 'cover' }}
                priority={false}
              />
            </div>
          ))}
        </div>

        {/* gradiente de legibilidad (transparente → negro 20%) */}
        <div className="fs-grad" aria-hidden />

        {/* titular FIJO + specs (sin parallax) */}
        <div className="fs-title" aria-hidden>
          <div className="fs-word">Morningside</div>
          <div className="fs-word">Road</div>
          <div className="fs-specs">
            {specs.map((s, i) => (
              <span key={s}>
                {s}
                {i < specs.length - 1 && <span className="dot" aria-hidden> ● </span>}
              </span>
            ))}
          </div>
        </div>

        {/* badge 3D tour (activar con has3DTour) */}
        {has3DTour && <span className="fs-badge">↻ 3D TOUR</span>}

        {/* flechas (visibles en hover / siempre en touch) */}
        {photos.length > 1 && (
          <>
            <button className="fs-arrow fs-prev" onClick={() => go(-1)} aria-label="Previous photo">←</button>
            <button className="fs-arrow fs-next" onClick={() => go(1)} aria-label="Next photo">→</button>
          </>
        )}

        {/* dots + CTA — esquina inferior derecha */}
        <div className="fs-corner">
          {photos.length > 1 && (
            <div className="fs-dots" role="tablist" aria-label="Choose photo">
              {photos.map((_, i) => (
                <button key={i} className={i === idx ? 'on' : ''} onClick={() => setIdx(i)}
                  aria-label={`Photo ${i + 1} of ${photos.length}`} aria-current={i === idx} />
              ))}
            </div>
          )}
          <a href={DETAIL} className="fs-cta" style={{ fontFamily: FONT }}>View property →</a>
        </div>
      </div>
    </section>
  );
}
