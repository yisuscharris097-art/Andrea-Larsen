'use client';

/** Reels — bloque negro a sangre con carrusel vertical estilo Reels/TikTok.
 *  Foco central (los laterales atenuados); al hacer swipe/scroll o click, el
 *  foco se mueve. Solo el reel centrado reproduce (IntersectionObserver-like via
 *  scroll). Cada reel enlaza a su ficha; el CTA de la sección va al VENDEDOR. */
import Link from 'next/link';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { reels } from '@/lib/reels';
import { bySlug } from '@/lib/properties';

const items = reels.map((r) => ({ reel: r, p: bySlug(r.slug) })).filter((x) => x.p);

export default function Reels() {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(0);

  // el card más centrado en el track = activo (reproduce; los demás pausan)
  const recompute = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const mid = track.scrollLeft + track.clientWidth / 2;
    let best = 0, bestD = Infinity;
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const c = el.offsetLeft + el.offsetWidth / 2;
      const d = Math.abs(c - mid);
      if (d < bestD) { bestD = d; best = i; }
    });
    setActive((prev) => (prev === best ? prev : best));
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; recompute(); }); };
    track.addEventListener('scroll', onScroll, { passive: true });
    recompute();
    return () => { track.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [recompute]);

  // reproduce solo el activo (muted playsinline); pausa el resto
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === active) { v.play().catch(() => {}); }
      else { v.pause(); }
    });
  }, [active]);

  const scrollTo = (i: number) => {
    const el = cardRefs.current[i];
    const track = trackRef.current;
    if (!el || !track) return;
    track.scrollTo({ left: el.offsetLeft - (track.clientWidth - el.offsetWidth) / 2, behavior: 'smooth' });
  };

  if (items.length === 0) return null;

  return (
    <section className="reels-sec" aria-label="On the feed">
      <div className="reels-head">
        <div>
          <span className="reels-eyebrow">● On the feed</span>
          <h2 className="reels-title">See the homes<br />in <span className="st-it">motion.</span></h2>
        </div>
        <p className="reels-sub">
          The way Andrea markets a listing — full-screen, cinematic, everywhere your buyers already scroll.
          Tap any home to see it in full.
        </p>
      </div>

      <div className="reels-stage">
        <button className="reels-arrow prev" aria-label="Previous" onClick={() => scrollTo(Math.max(0, active - 1))}>←</button>
        <div className="reels-track" ref={trackRef}>
          {items.map(({ reel, p }, i) => {
            const poster = reel.poster || p!.photo;
            const chip = reel.result?.label || p!.status;
            return (
              <div
                key={reel.slug}
                ref={(el) => { cardRefs.current[i] = el; }}
                className={`reel${i === active ? ' on' : ''}`}
                onClick={() => (i === active ? null : scrollTo(i))}
              >
                <div className="reel-media">
                  {reel.video ? (
                    <video
                      ref={(el) => { videoRefs.current[i] = el; }}
                      poster={poster} muted loop playsInline preload="none"
                      aria-label={`${p!.address} reel`}
                    >
                      <source src={reel.video} type="video/mp4" />
                    </video>
                  ) : (
                    <Image src={poster} alt={`${p!.address}, ${p!.city}`} fill sizes="(max-width:760px) 78vw, 300px" style={{ objectFit: 'cover' }} className="reel-poster" />
                  )}
                  <span className={`reel-chip${reel.result?.sold ? ' sold' : ''}`}>{chip}</span>
                  {reel.instagram && (
                    <a href={reel.instagram} target="_blank" rel="noopener noreferrer" className="reel-ig" aria-label="Watch on Instagram" onClick={(e) => e.stopPropagation()}>↗ IG</a>
                  )}
                  <div className="reel-grad" aria-hidden />
                  <Link href={`/listing/${reel.slug}`} className="reel-info" data-curtain={p!.address} onClick={(e) => e.stopPropagation()}>
                    <span className="reel-addr">{p!.address}</span>
                    <span className="reel-meta">{p!.city}, {p!.state} · {p!.priceDisplay} · View home →</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        <button className="reels-arrow next" aria-label="Next" onClick={() => scrollTo(Math.min(items.length - 1, active + 1))}>→</button>
      </div>

      {/* dots */}
      <div className="reels-dots" role="tablist" aria-label="Choose reel">
        {items.map((_, i) => (
          <button key={i} className={i === active ? 'on' : ''} aria-label={`Reel ${i + 1}`} aria-current={i === active} onClick={() => scrollTo(i)} />
        ))}
      </div>

      {/* CTA al VENDEDOR */}
      <div className="reels-cta">
        <p>Thinking of selling? This is how your home would be shown.</p>
        <Link href="/sell" className="st-pill st-pill--solid" data-curtain="Sell">See what your home is worth →</Link>
      </div>
    </section>
  );
}
