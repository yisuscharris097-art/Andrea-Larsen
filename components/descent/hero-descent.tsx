'use client';

/**
 * HeroDescent — "El Descenso".
 * Scroll-scrubbed drone sequence (canvas + frame sequence, loftthirtyone-style):
 * gate ("BEGIN THE DESCENT") → pinned scrub through clouds → Miami tower →
 * interior → happy family → settles EXACTLY on Andrea's real photo, then the
 * scroll releases into the collection.
 *
 * Assets: /public/descent/frames/f-000..159.webp (from Seedance 2.0 1080p),
 *         /public/descent/andrea-final.jpg (real 4K end frame, sharp overlay).
 * Palette: paper #FAF9F7 · ink #1A1714 · oxblood #7A1F1B · gold #C8A45D.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';

const FRAMES = 160;
const SCRUB_VH = 560; // scroll length of the pinned descent, in vh
const frameSrc = (i: number) => `/descent/frames/f-${String(i).padStart(3, '0')}.webp`;

const INK = '#1A1714';
const OXBLOOD = '#7A1F1B';
const GOLD = '#C8A45D';
const FONT = "'Archivo', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif";
const SERIF = "'Cormorant Garamond', Georgia, serif";

type Beat = {
  from: number;
  to: number;
  hard: string;
  soft?: string;
  align: 'left' | 'right' | 'center';
};

const BEATS: Beat[] = [
  { from: 0.05, to: 0.22, hard: 'WHERE YOU LIVE', soft: 'changes how you live.', align: 'left' },
  { from: 0.3, to: 0.45, hard: '27 YEARS. TOP 1%.', soft: 'Berkshire Hathaway HomeServices', align: 'right' },
  { from: 0.55, to: 0.7, hard: 'THIS IS THE FEELING', soft: 'we sell.', align: 'left' },
  { from: 0.78, to: 0.9, hard: '', soft: 'Meet the one who makes it happen.', align: 'center' },
];

export default function HeroDescent() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const loadedRef = useRef<boolean[]>([]);
  const progressRef = useRef(0);
  const drawnRef = useRef(-1);
  const [started, setStarted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [progressUi, setProgressUi] = useState(0); // coarse, for text beats/overlays
  const startedRef = useRef(false);

  // ── frame drawing (object-fit: cover) ─────────────────────────────────────
  const draw = useCallback((idx: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[idx];
    if (!canvas || !img || !loadedRef.current[idx]) return false;
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;
    const cw = canvas.width, ch = canvas.height;
    const iw = img.naturalWidth, ih = img.naturalHeight;
    const s = Math.max(cw / iw, ch / ih);
    const dw = iw * s, dh = ih * s;
    // portrait viewports: bias the crop to the right third, where Andrea sits
    const fx = ch > cw ? 0.68 : 0.5;
    ctx.drawImage(img, (cw - dw) * fx, (ch - dh) / 2, dw, dh);
    drawnRef.current = idx;
    return true;
  }, []);

  const drawNearest = useCallback((target: number) => {
    // draw the closest loaded frame at or below target (falls back upward)
    for (let i = target; i >= 0; i--) if (loadedRef.current[i]) return draw(i);
    for (let i = target + 1; i < FRAMES; i++) if (loadedRef.current[i]) return draw(i);
    return false;
  }, [draw]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    if (mq.matches) return; // static hero — no scrub machinery

    // ── canvas sizing ────────────────────────────────────────────────────────
    const canvas = canvasRef.current!;
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      if (drawnRef.current >= 0) draw(drawnRef.current);
      else drawNearest(0);
    };
    size();
    window.addEventListener('resize', size);

    // ── frame preloading: first screenful eagerly, the rest trickled ────────
    loadedRef.current = new Array(FRAMES).fill(false);
    imagesRef.current = new Array(FRAMES).fill(null);
    const load = (i: number) =>
      new Promise<void>((res) => {
        const img = new Image();
        img.onload = () => { loadedRef.current[i] = true; imagesRef.current[i] = img; res(); };
        img.onerror = () => res();
        img.src = frameSrc(i);
      });
    let cancelled = false;
    (async () => {
      await load(0);
      if (!cancelled) drawNearest(0);
      // eager: every 8th frame for fast coverage, then fill the gaps
      const eager: number[] = [];
      for (let i = 8; i < FRAMES; i += 8) eager.push(i);
      await Promise.all(eager.map(load));
      const rest: number[] = [];
      for (let i = 1; i < FRAMES; i++) if (!loadedRef.current[i]) rest.push(i);
      const CHUNK = 12;
      for (let c = 0; c < rest.length && !cancelled; c += CHUNK) {
        await Promise.all(rest.slice(c, c + CHUNK).map(load));
      }
    })();

    // ── smooth scroll (Lenis) — the scrub reads its output ──────────────────
    const lenis = new Lenis({ duration: 1.05, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      // progress of the pinned section
      const wrap = wrapRef.current;
      if (wrap) {
        const rect = wrap.getBoundingClientRect();
        const total = wrap.offsetHeight - window.innerHeight;
        const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
        progressRef.current = p;
        const idx = Math.min(FRAMES - 1, Math.round(p * (FRAMES - 1)));
        if (idx !== drawnRef.current) drawNearest(idx);
        setProgressUi((prev) => (Math.abs(prev - p) > 0.004 ? p : prev));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // ── gate: hold the page until the visitor begins the descent ────────────
    if (!startedRef.current) lenis.stop();
    (window as any).__descentLenis = lenis;

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      lenis.destroy();
      delete (window as any).__descentLenis;
      window.removeEventListener('resize', size);
    };
  }, [draw, drawNearest]);

  const begin = () => {
    startedRef.current = true;
    setStarted(true);
    const lenis = (window as any).__descentLenis as Lenis | undefined;
    lenis?.start();
    // a gentle nudge so the descent visibly begins
    lenis?.scrollTo(window.innerHeight * 0.6, { duration: 1.6 });
  };

  const p = progressUi;
  const ended = p >= 0.965;

  // ── reduced motion: calm, static hero on the real photo ────────────────────
  if (reduced) {
    return (
      <section style={{ position: 'relative', minHeight: '100svh', background: INK }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/descent/andrea-final.jpg" alt="Andrea Larsen welcoming you inside a Miami penthouse living room" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,12,10,.72), rgba(15,12,10,.06) 55%)' }} />
        <FinalCard visible />
      </section>
    );
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative', height: `${SCRUB_VH}vh`, background: INK }}>
      <div style={{ position: 'sticky', top: 0, height: '100svh', overflow: 'hidden' }}>
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} aria-hidden />

        {/* sharp real photo crossfades over the last frames — the invisible cut */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/descent/andrea-final.jpg"
          alt="Andrea Larsen — REALTOR®, Luxury Property Specialist — welcoming you inside a Miami penthouse"
          className="descent-final-img"
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
            opacity: ended ? 1 : 0, transition: 'opacity 600ms ease-out', pointerEvents: 'none',
          }}
        />

        {/* film scrim for text legibility */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to top, rgba(15,12,10,.55), rgba(15,12,10,0) 34%), linear-gradient(to bottom, rgba(15,12,10,.3), rgba(15,12,10,0) 22%)' }} />

        {/* luxury text beats */}
        {BEATS.map((b, i) => {
          const active = started && p >= b.from && p <= b.to;
          const local = active ? (p - b.from) / (b.to - b.from) : 0;
          const drift = (0.5 - local) * 26; // slow counter-drift, px
          return (
            <div
              key={i}
              aria-hidden={!active}
              style={{
                position: 'absolute',
                left: b.align === 'left' ? 'clamp(1.4rem, 6vw, 7rem)' : b.align === 'center' ? '50%' : 'auto',
                right: b.align === 'right' ? 'clamp(1.4rem, 6vw, 7rem)' : 'auto',
                top: b.align === 'center' ? '50%' : '58%',
                transform: `translate(${b.align === 'center' ? '-50%' : '0'}, calc(${b.align === 'center' ? '-50%' : '-50%'} + ${drift}px))`,
                textAlign: b.align,
                opacity: active ? Math.min(1, local * 4, (1 - local) * 4) : 0,
                transition: 'opacity 180ms ease-out',
                pointerEvents: 'none',
                maxWidth: 'min(86vw, 880px)',
              }}
            >
              {b.hard && (
                <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 'clamp(2rem, 6.4vw, 5.4rem)', lineHeight: 0.98, letterSpacing: '-0.015em', color: '#FCFAF6', textShadow: '0 2px 34px rgba(10,8,6,.55)', textTransform: 'uppercase' }}>
                  {b.hard}
                </div>
              )}
              {b.soft && (
                <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, fontSize: b.hard ? 'clamp(1.3rem, 3vw, 2.4rem)' : 'clamp(1.7rem, 4vw, 3.2rem)', color: '#F2E9DA', textShadow: '0 2px 26px rgba(10,8,6,.6)', marginTop: b.hard ? '0.55rem' : 0 }}>
                  {b.soft}
                </div>
              )}
              <div aria-hidden style={{ width: 64, height: 1, background: GOLD, opacity: 0.9, margin: b.align === 'center' ? '1rem auto 0' : b.align === 'right' ? '1rem 0 0 auto' : '1rem 0 0' }} />
            </div>
          );
        })}

        {/* final reveal card */}
        <FinalCard visible={ended} />

        {/* gate */}
        <div
          style={{
            position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
            background: 'rgba(14,11,9,.28)', backdropFilter: started ? 'blur(0px)' : 'blur(14px)',
            WebkitBackdropFilter: started ? 'blur(0px)' : 'blur(14px)',
            opacity: started ? 0 : 1, transition: 'opacity 700ms ease-out, backdrop-filter 900ms ease-out',
            pointerEvents: started ? 'none' : 'auto',
          }}
        >
          <div style={{ textAlign: 'center', padding: '0 1.5rem' }}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: '.72rem', letterSpacing: '.42em', color: '#EFE7D8', textTransform: 'uppercase' }}>
              Love Living Coast2Coast
            </div>
            <h1 style={{ fontFamily: FONT, fontWeight: 900, fontSize: 'clamp(2.2rem, 7vw, 5.6rem)', lineHeight: 0.98, letterSpacing: '-0.02em', color: '#FCFAF6', textTransform: 'uppercase', margin: '1.1rem 0 0' }}>
              The Descent
            </h1>
            <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 'clamp(1.05rem, 2.4vw, 1.5rem)', color: '#EADFCB', margin: '0.9rem 0 2.2rem' }}>
              From the clouds of Miami, down to the one who&apos;ll hand you the keys.
            </p>
            <button
              onClick={begin}
              style={{
                fontFamily: FONT, fontWeight: 800, letterSpacing: '.3em', textTransform: 'uppercase', fontSize: '.78rem',
                color: INK, background: '#FCFAF6', border: `1px solid ${GOLD}`,
                padding: '1.05rem 2.6rem', cursor: 'pointer', borderRadius: 999,
                boxShadow: `0 0 0 6px rgba(200,164,93,.16), 0 18px 44px rgba(8,6,4,.45)`,
                animation: 'descentPulse 2.6s ease-out infinite',
              }}
            >
              Begin the descent ↓
            </button>
          </div>
        </div>

        {/* progress hairline */}
        <div aria-hidden style={{ position: 'absolute', left: 0, top: 0, height: 2, width: `${Math.round(p * 100)}%`, background: `linear-gradient(90deg, ${OXBLOOD}, ${GOLD})`, opacity: started && !ended ? 1 : 0, transition: 'opacity 300ms ease-out' }} />
      </div>

      <style>{`
        @media (orientation: portrait) {
          .descent-final-img { object-position: 68% center; }
        }
        @keyframes descentPulse {
          0%   { box-shadow: 0 0 0 4px rgba(200,164,93,.22), 0 18px 44px rgba(8,6,4,.45); }
          50%  { box-shadow: 0 0 0 14px rgba(200,164,93,.05), 0 18px 44px rgba(8,6,4,.45); }
          100% { box-shadow: 0 0 0 4px rgba(200,164,93,.22), 0 18px 44px rgba(8,6,4,.45); }
        }
      `}</style>
    </div>
  );
}

/** Final overlay: Andrea's identity + CTA, shown when the descent settles on her. */
function FinalCard({ visible }: { visible: boolean }) {
  return (
    <div
      style={{
        position: 'absolute', left: 'clamp(1.4rem, 6vw, 7rem)', bottom: 'clamp(1.6rem, 7vh, 4.5rem)',
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(18px)',
        transition: 'opacity 500ms ease-out 150ms, transform 500ms ease-out 150ms',
        pointerEvents: visible ? 'auto' : 'none', maxWidth: 'min(88vw, 640px)',
      }}
    >
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: '.7rem', letterSpacing: '.42em', color: '#EFE7D8', textTransform: 'uppercase', textShadow: '0 1px 18px rgba(10,8,6,.75)' }}>
        Love Living Coast2Coast
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 'clamp(2.4rem, 6.6vw, 5rem)', lineHeight: 0.96, letterSpacing: '-0.02em', color: '#FCFAF6', textTransform: 'uppercase', margin: '0.7rem 0 0.6rem', textShadow: '0 2px 30px rgba(10,8,6,.55)' }}>
        Andrea Larsen
      </div>
      <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 'clamp(1.05rem, 2.2vw, 1.4rem)', color: '#F0E7D6', textShadow: '0 1px 20px rgba(10,8,6,.65)' }}>
        REALTOR® · Luxury Property Specialist · 27+ years · Top 1% in state
      </div>
      <div style={{ display: 'flex', gap: '0.9rem', flexWrap: 'wrap', marginTop: '1.6rem' }}>
        <a
          href="https://calendly.com/andrealarsen"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: FONT, fontWeight: 800, letterSpacing: '.24em', textTransform: 'uppercase', fontSize: '.74rem',
            color: '#FCFAF6', background: OXBLOOD, padding: '1rem 1.9rem', borderRadius: 999,
            textDecoration: 'none', border: '1px solid rgba(200,164,93,.55)', boxShadow: '0 14px 36px rgba(8,6,4,.4)',
          }}
        >
          Schedule a private viewing
        </a>
        <a
          href="#collection"
          style={{
            fontFamily: FONT, fontWeight: 800, letterSpacing: '.24em', textTransform: 'uppercase', fontSize: '.74rem',
            color: '#FCFAF6', padding: '1rem 1.6rem', borderRadius: 999, textDecoration: 'none',
            border: '1px solid rgba(252,250,246,.45)',
          }}
        >
          The collection ↓
        </a>
      </div>
    </div>
  );
}
