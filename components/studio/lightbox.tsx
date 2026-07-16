'use client';

/**
 * Lightbox — galería a pantalla completa: fondo negro, drag físico con
 * framer-motion, flechas/teclado/swipe, contador "7 / 25", tira de thumbnails,
 * zoom al click, cierre con Esc / × / arrastre vertical. Lazy: solo se montan
 * la foto activa y sus vecinas.
 */

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

export function Lightbox({
  photos, alt, index, onClose, onIndex,
}: {
  photos: string[]; alt: string; index: number | null;
  onClose: () => void; onIndex: (i: number) => void;
}) {
  const [zoom, setZoom] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);
  const open = index !== null;
  const i = index ?? 0;

  const go = useCallback((d: number) => {
    setZoom(false);
    onIndex(((i + d) % photos.length + photos.length) % photos.length);
  }, [i, photos.length, onIndex]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, go, onClose]);

  // centrar el thumbnail activo
  useEffect(() => {
    const strip = stripRef.current;
    const el = strip?.children[i] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [i, open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog" aria-modal="true" aria-label={`${alt} — photo gallery`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.28 }}
          style={{ position: 'fixed', inset: 0, zIndex: 120, background: 'rgba(5,5,5,0.96)', display: 'flex', flexDirection: 'column' }}
        >
          {/* top bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.4rem', color: '#eee' }}>
            <span style={{ fontFamily: 'var(--grotesk)', fontWeight: 500, fontVariantNumeric: 'tabular-nums', fontSize: '0.95rem' }}>
              {i + 1} / {photos.length}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#999', textAlign: 'center', flex: 1, padding: '0 1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{alt}</span>
            <button onClick={onClose} aria-label="Close gallery" style={{ width: 42, height: 42, borderRadius: 999, border: '1px solid rgba(255,255,255,0.3)', background: 'transparent', color: '#fff', fontSize: '1.15rem', cursor: 'pointer' }}>×</button>
          </div>

          {/* stage */}
          <div style={{ position: 'relative', flex: 1, minHeight: 0, display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={photos[i]}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.32, ease: EASE }}
                drag={zoom ? false : true}
                dragElastic={0.18}
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragTransition={{ bounceStiffness: 380, bounceDamping: 30 }}
                onDragEnd={(_, info) => {
                  if (Math.abs(info.offset.y) > 140 && Math.abs(info.offset.y) > Math.abs(info.offset.x)) { onClose(); return; }
                  if (info.offset.x < -80 || info.velocity.x < -500) go(1);
                  else if (info.offset.x > 80 || info.velocity.x > 500) go(-1);
                }}
                onClick={() => setZoom(!zoom)}
                style={{ position: 'relative', width: zoom ? '160%' : 'min(94vw, 1400px)', height: zoom ? '160%' : '100%', cursor: zoom ? 'zoom-out' : 'zoom-in' }}
              >
                <Image src={photos[i]} alt={`${alt} — photo ${i + 1}`} fill sizes="94vw" style={{ objectFit: 'contain' }} priority draggable={false} />
              </motion.div>
            </AnimatePresence>

            {/* preload vecinas */}
            <div style={{ display: 'none' }} aria-hidden>
              {[i + 1, i - 1].map((k) => {
                const idx = ((k % photos.length) + photos.length) % photos.length;
                // eslint-disable-next-line @next/next/no-img-element
                return <img key={idx} src={photos[idx]} alt="" />;
              })}
            </div>

            <button onClick={() => go(-1)} aria-label="Previous photo" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', width: 48, height: 48, borderRadius: 999, border: '1px solid rgba(255,255,255,0.28)', background: 'rgba(20,20,20,0.5)', color: '#fff', fontSize: '1.15rem', cursor: 'pointer', backdropFilter: 'blur(6px)' }}>←</button>
            <button onClick={() => go(1)} aria-label="Next photo" style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', width: 48, height: 48, borderRadius: 999, border: '1px solid rgba(255,255,255,0.28)', background: 'rgba(20,20,20,0.5)', color: '#fff', fontSize: '1.15rem', cursor: 'pointer', backdropFilter: 'blur(6px)' }}>→</button>
          </div>

          {/* tira de thumbnails */}
          <div ref={stripRef} style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0.9rem 1.4rem 1.2rem', scrollbarWidth: 'none' }}>
            {photos.map((p, k) => (
              <button key={p} onClick={() => { setZoom(false); onIndex(k); }} aria-label={`Photo ${k + 1}`}
                style={{ flex: '0 0 72px', height: 52, borderRadius: 8, overflow: 'hidden', border: k === i ? '2px solid #E3C173' : '2px solid transparent', opacity: k === i ? 1 : 0.55, padding: 0, cursor: 'pointer', background: '#111', transition: 'opacity 200ms var(--ease)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
