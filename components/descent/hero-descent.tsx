'use client';

/**
 * HeroDescent — "El Descenso".
 * Scroll-scrubbed drone sequence (canvas + frame sequence, loftthirtyone-style):
 * gate ("BEGIN THE DESCENT") → pinned scrub through clouds → Miami tower →
 * interior → happy family → settles EXACTLY on Andrea's real photo, then the
 * scroll releases into the collection.
 *
 * ⚠️ REGLA INTOCABLE: la lógica del video/scrub (frames, Lenis, gate, timing)
 * no se toca. El rediseño premium vive SOLO en la capa de overlay: wordmark
 * gigante entrelazado, nav en pills, microtexto editorial en flancos, beats
 * re-tipografiados (grotesk 500 + itálica serif + guión lima) y hotspots glass
 * sobre el frame final.
 *
 * Assets: /public/descent/frames/f-000..159.webp (Seedance 2.0 1080p),
 *         /public/descent/andrea-final.jpg (real 4K end frame, sharp overlay).
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';

const FRAMES = 160;
const SCRUB_VH = 560; // scroll length of the pinned descent, in vh
const frameSrc = (i: number) => `/descent/frames/f-${String(i).padStart(3, '0')}.webp`;

const LIME = '#C8F31D';
const GROTESK = "var(--font-grotesk), 'Archivo', system-ui, sans-serif";
const SERIF = "var(--font-serif), 'Instrument Serif', Georgia, serif";
const BODY = "var(--font-body), 'Inter', system-ui, sans-serif";

type Beat = {
  from: number;
  to: number;
  hard: React.ReactNode;
  soft?: React.ReactNode;
  align: 'left' | 'right' | 'center';
};

const BEATS: Beat[] = [
  { from: 0.05, to: 0.22, hard: <>Where you <em>live</em></>, soft: 'changes how you live.', align: 'left' },
  { from: 0.3, to: 0.45, hard: <>27 years. Top <span style={{ color: LIME }}>–</span>1%.</>, soft: 'Berkshire Hathaway HomeServices', align: 'right' },
  { from: 0.55, to: 0.7, hard: <>This is the <em>feeling</em></>, soft: 'we sell.', align: 'left' },
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
  const exitFade = Math.min(1, Math.max(0, (p - 0.02) * 14)); // overlay exit parallax

  // ── reduced motion: calm, static hero on the real photo ────────────────────
  if (reduced) {
    return (
      <section style={{ position: 'relative', minHeight: '100svh', background: '#0d0d0d' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/descent/andrea-final.jpg" alt="Andrea Larsen welcoming you inside a Miami penthouse living room" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,.72), rgba(10,10,10,.06) 55%)' }} />
        <HeroNav visible />
        <FinalCard visible />
      </section>
    );
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative', height: `${SCRUB_VH}vh`, background: '#0d0d0d' }}>
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

        {/* film scrim for text legibility (local, nunca oscurece todo) */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to top, rgba(10,10,10,.5), rgba(10,10,10,0) 32%), linear-gradient(to bottom, rgba(10,10,10,.34), rgba(10,10,10,0) 20%)' }} />

        {/* nav pills — aparece con el gate y permanece */}
        <HeroNav visible={!ended} />

        {/* microtexto editorial en flancos (patrón Suffo) */}
        <div className="st-flank" style={{ left: 'clamp(1.25rem, 4vw, 4rem)', top: '50%', transform: 'translateY(-50%)', opacity: 1 - exitFade * 0.6 }}>
          Quality // Trust // Legacy //
        </div>
        <div className="st-flank" style={{ right: 'clamp(1.25rem, 4vw, 4rem)', top: '50%', transform: 'translateY(-50%)', textAlign: 'right', opacity: 1 - exitFade * 0.6 }}>
          Wellington — Miami, FL<br />© 2026
        </div>

        {/* luxury text beats — grotesk 500 + itálica serif */}
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
                maxWidth: 'min(88vw, 960px)',
                zIndex: 8,
              }}
            >
              {b.hard && (
                <div style={{ fontFamily: GROTESK, fontWeight: 500, fontStretch: '115%', fontSize: 'clamp(2.4rem, 7.4vw, 6.8rem)', lineHeight: 0.95, letterSpacing: '-0.03em', color: '#FCFCFA', textShadow: '0 2px 34px rgba(8,8,8,.55)' }}>
                  <BeatText>{b.hard}</BeatText>
                </div>
              )}
              {b.soft && (
                <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400, fontSize: b.hard ? 'clamp(1.3rem, 3vw, 2.5rem)' : 'clamp(1.7rem, 4vw, 3.4rem)', color: '#F0F0EC', textShadow: '0 2px 26px rgba(8,8,8,.6)', marginTop: b.hard ? '0.5rem' : 0 }}>
                  {b.soft}
                </div>
              )}
            </div>
          );
        })}

        {/* final reveal: hotspots glass + identity card */}
        <Hotspots visible={ended} />
        <FinalCard visible={ended} />

        {/* gate — wordmark gigante + reveal por máscara */}
        <div
          style={{
            position: 'absolute', inset: 0, zIndex: 20, display: 'grid', placeItems: 'center',
            background: 'rgba(10,9,8,.3)', backdropFilter: started ? 'blur(0px)' : 'blur(14px)',
            WebkitBackdropFilter: started ? 'blur(0px)' : 'blur(14px)',
            opacity: started ? 0 : 1, transition: 'opacity 700ms ease-out, backdrop-filter 900ms ease-out',
            pointerEvents: started ? 'none' : 'auto', overflow: 'hidden',
          }}
        >
          {/* wordmark entrelazado, cortado por el borde inferior del gate */}
          <div aria-hidden className="st-hero-mark">andrea</div>

          <div style={{ textAlign: 'center', padding: '0 1.5rem', position: 'relative', zIndex: 4 }}>
            <div className="gate-line" style={{ overflow: 'hidden' }}>
              <div className="gate-in" style={{ fontFamily: BODY, fontWeight: 500, fontSize: '.72rem', letterSpacing: '.16em', color: '#EFEFEA', textTransform: 'uppercase', animationDelay: '80ms' }}>
                ● Luxury Real Estate — Love Living Coast2Coast
              </div>
            </div>
            <h1 style={{ margin: '1.2rem 0 0' }}>
              <span style={{ display: 'block', overflow: 'hidden' }}>
                <span className="gate-in" style={{ display: 'block', fontFamily: GROTESK, fontWeight: 500, fontStretch: '115%', fontSize: 'clamp(2.6rem, 8vw, 7.5rem)', lineHeight: 0.95, letterSpacing: '-0.03em', color: '#FCFCFA', animationDelay: '160ms' }}>
                  The <em style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400 }}>descent</em>
                </span>
              </span>
              <span style={{ display: 'block', overflow: 'hidden' }}>
                <span className="gate-in" style={{ display: 'block', fontFamily: GROTESK, fontWeight: 500, fontStretch: '115%', fontSize: 'clamp(2.6rem, 8vw, 7.5rem)', lineHeight: 0.95, letterSpacing: '-0.03em', color: '#FCFCFA', animationDelay: '240ms' }}>
                  begins here<span style={{ color: LIME }}>.</span>
                </span>
              </span>
            </h1>
            <div className="gate-line" style={{ overflow: 'hidden', marginTop: '1rem' }}>
              <p className="gate-in" style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 'clamp(1.05rem, 2.4vw, 1.5rem)', color: '#E9E9E2', margin: 0, animationDelay: '320ms' }}>
                From the clouds of Miami, down to the one who&apos;ll hand you the keys.
              </p>
            </div>
            <button
              onClick={begin}
              className="gate-in"
              style={{
                marginTop: '2.4rem', fontFamily: BODY, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', fontSize: '.78rem',
                color: '#0d0d0d', background: '#FCFCFA', border: '1px solid rgba(255,255,255,.5)',
                padding: '1.05rem 2.6rem', cursor: 'pointer', borderRadius: 999,
                boxShadow: '0 18px 44px rgba(6,6,6,.45)', animationDelay: '420ms',
              }}
            >
              Begin the descent ↓
            </button>
          </div>
        </div>

        {/* progress hairline */}
        <div aria-hidden style={{ position: 'absolute', left: 0, top: 0, height: 2, width: `${Math.round(p * 100)}%`, background: LIME, opacity: started && !ended ? 1 : 0, transition: 'opacity 300ms ease-out', zIndex: 31 }} />
      </div>

      <style>{`
        @media (orientation: portrait) {
          .descent-final-img { object-position: 68% center; }
        }
        .gate-in { animation: gateUp 800ms cubic-bezier(0.22, 1, 0.36, 1) both; }
        @keyframes gateUp { from { transform: translateY(115%); opacity: 0.4; } to { transform: translateY(0); opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .gate-in { animation: none; } }
      `}</style>
    </div>
  );
}

/** Beat hard text: renders <em> children in the serif italic accent (css en studio.css). */
function BeatText({ children }: { children: React.ReactNode }) {
  return <span className="beat-hard">{children}</span>;
}

/** Nav pills flotando sobre el video (activo en blanco sólido). */
function HeroNav({ visible }: { visible: boolean }) {
  return (
    <nav className="st-nav" aria-label="Primary" style={{ opacity: visible ? 1 : 0, transition: 'opacity 400ms ease-out', pointerEvents: visible ? 'auto' : 'none' }}>
      <div className="grp">
        <a className="st-pill active" href="#top">Home</a>
        <a className="st-pill" href="#collection">Collection</a>
        <a className="st-pill" href="#agent">About</a>
      </div>
      <div className="grp secondary">
        <a className="st-pill" href="https://calendly.com/andrealarsen" target="_blank" rel="noopener noreferrer">Start exploring →</a>
      </div>
    </nav>
  );
}

/** Hotspots glassmorphism sobre el frame final (la sala con Andrea). */
function Hotspots({ visible }: { visible: boolean }) {
  const spots = [
    { left: '30%', top: '38%', t: 'The living room', d: 'Ivory + marble, floor-to-ceiling ocean light.' },
    { left: '88%', top: '34%', t: 'Miami skyline', d: 'Penthouse level — the coast at your window.' },
    { left: '58%', top: '80%', t: 'Your host', d: 'Andrea Larsen · REALTOR® · Top 1% in state.' },
  ];
  return (
    <div aria-hidden={!visible} style={{ position: 'absolute', inset: 0, opacity: visible ? 1 : 0, transition: 'opacity 500ms ease-out 300ms', pointerEvents: visible ? 'auto' : 'none', zIndex: 7 }}>
      {spots.map((s, i) => (
        <div key={i} className="st-spot" style={{ left: s.left, top: s.top }}>
          <button className="dot" aria-label={s.t} />
          <div className="tip"><b>{s.t}</b><span>{s.d}</span></div>
        </div>
      ))}
    </div>
  );
}

/** Final overlay: Andrea's identity + CTA, shown when the descent settles on her. */
function FinalCard({ visible }: { visible: boolean }) {
  return (
    <div
      style={{
        position: 'absolute', left: 'clamp(1.4rem, 6vw, 7rem)', bottom: 'clamp(1.6rem, 7vh, 4.5rem)', zIndex: 9,
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(18px)',
        transition: 'opacity 500ms ease-out 150ms, transform 500ms ease-out 150ms',
        pointerEvents: visible ? 'auto' : 'none', maxWidth: 'min(88vw, 680px)',
      }}
    >
      <div style={{ fontFamily: BODY, fontWeight: 500, fontSize: '.7rem', letterSpacing: '.16em', color: '#EFEFEA', textTransform: 'uppercase', textShadow: '0 1px 18px rgba(8,8,8,.75)' }}>
        ● Love Living Coast2Coast
      </div>
      <div style={{ fontFamily: GROTESK, fontWeight: 500, fontStretch: '115%', fontSize: 'clamp(2.6rem, 7vw, 5.6rem)', lineHeight: 0.95, letterSpacing: '-0.03em', color: '#FCFCFA', margin: '0.6rem 0 0.5rem', textShadow: '0 2px 30px rgba(8,8,8,.55)' }}>
        Andrea <em style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400 }}>Larsen</em>
      </div>
      <div style={{ fontFamily: BODY, fontSize: 'clamp(.85rem, 1.6vw, 1rem)', color: '#EDEDE8', textShadow: '0 1px 20px rgba(8,8,8,.65)' }}>
        REALTOR® · Luxury Property Specialist · 27+ years · Top 1% in state
      </div>
      <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
        <a className="st-pill" style={{ background: '#FCFCFA', color: '#0d0d0d', borderColor: '#FCFCFA', fontWeight: 600 }} href="https://calendly.com/andrealarsen" target="_blank" rel="noopener noreferrer">
          Schedule a private viewing
        </a>
        <a className="st-pill" href="#featured">The collection ↓</a>
      </div>
    </div>
  );
}
