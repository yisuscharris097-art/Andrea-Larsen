'use client';

/**
 * Flagship — the $18.8M Pineville estate, ImageExpansionTypography-style
 * (Awwwards Pack / Scroll 17, ported to React without GSAP): a pinned stage
 * where the estate photo expands from an editorial inset to full bleed via
 * clip-path scrub while the display type splits apart; price, specs and CTA
 * settle in over the full-bleed image.
 */

import { useEffect, useRef, useState } from 'react';
import Magnetic from './magnetic';

const INK = '#1A1714';
const OXBLOOD = '#7A1F1B';
const GOLD = '#C8A45D';
const PAPER = '#FAF9F7';
const FONT = "'Archivo', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif";
const SERIF = "'Cormorant Garamond', Georgia, serif";

const DETAIL = 'https://andrealarsen.foxroach.com/realestate/details/12814728/465-pineville-road-newtown-pa-18940';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** progress of p inside [a, b] */
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export default function Flagship() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    let raf = 0;
    const tick = () => {
      const wrap = wrapRef.current;
      if (wrap) {
        const rect = wrap.getBoundingClientRect();
        const total = wrap.offsetHeight - window.innerHeight;
        const np = total > 0 ? clamp01(-rect.top / total) : 0;
        setP((prev) => (Math.abs(prev - np) > 0.003 ? np : prev));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // ── choreography ────────────────────────────────────────────────────────────
  const grow = reduced ? 1 : easeOut(seg(p, 0.06, 0.6)); // image inset → full bleed
  const insetY = 18 - grow * 18; // %
  const insetX = 24 - grow * 24; // %
  const veil = (1 - (reduced ? 1 : easeOut(seg(p, 0.2, 0.62)))) * 0.34; // darkens the inset while the title sits on it
  const split = reduced ? 1 : easeOut(seg(p, 0.2, 0.62)); // title splits apart (after a still beat)
  const info = reduced ? 1 : easeOut(seg(p, 0.66, 0.88)); // price/specs/CTA reveal

  return (
    <div ref={wrapRef} style={{ position: 'relative', height: reduced ? 'auto' : '320vh', background: PAPER }}>
      <section
        aria-label="The flagship residence — 465 Pineville Road"
        style={{ position: reduced ? 'relative' : 'sticky', top: 0, height: '100svh', overflow: 'hidden', display: 'grid', placeItems: 'center' }}
      >
        {/* estate photo — clip-path expansion */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/listings/casa-01.jpg"
          alt="465 Pineville Road, Newtown PA — 147-acre flagship estate"
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
            clipPath: `inset(${insetY}% ${insetX}% ${insetY}% ${insetX}%)`,
            transform: `scale(${1.12 - grow * 0.12})`,
            willChange: 'clip-path, transform',
          }}
        />
        {/* veil while the title reads over the inset */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: `rgba(18,14,11,${veil.toFixed(3)})`, clipPath: `inset(${insetY}% ${insetX}% ${insetY}% ${insetX}%)`, transform: `scale(${1.12 - grow * 0.12})`, pointerEvents: 'none' }} />
        {/* scrim grows with the image */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, opacity: grow * 0.9, background: 'linear-gradient(to top, rgba(15,12,10,.62), rgba(15,12,10,0) 46%)', pointerEvents: 'none' }} />

        {/* eyebrow */}
        <div
          aria-hidden={split > 0.6}
          style={{
            position: 'absolute', top: 'clamp(4rem, 9vh, 6rem)', left: 0, right: 0, textAlign: 'center',
            fontFamily: FONT, fontWeight: 800, fontSize: '.72rem', letterSpacing: '.42em', textTransform: 'uppercase',
            color: OXBLOOD, opacity: 1 - split, pointerEvents: 'none',
          }}
        >
          The flagship residence · Coming soon
        </div>

        {/* display type that splits as the image devours the stage */}
        <div aria-hidden={split > 0.85} style={{ position: 'relative', zIndex: 2, textAlign: 'center', pointerEvents: 'none' }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 'clamp(2.6rem, 7.6vw, 6.8rem)', lineHeight: 0.94, letterSpacing: '-0.015em', textTransform: 'uppercase', color: '#FCFAF6', textShadow: '0 2px 28px rgba(10,8,6,.45)', transform: `translateX(${-split * 34}vw)`, opacity: 1 - split * 0.92 }}>
            Pineville
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 'clamp(2.6rem, 7.6vw, 6.8rem)', lineHeight: 0.94, letterSpacing: '-0.015em', textTransform: 'uppercase', color: '#FCFAF6', textShadow: '0 2px 28px rgba(10,8,6,.45)', transform: `translateX(${split * 34}vw)`, opacity: 1 - split * 0.92 }}>
            Estate
          </div>
        </div>

        {/* info card over the full-bleed image */}
        <div
          style={{
            position: 'absolute', left: 'clamp(1.4rem, 6vw, 7rem)', right: 'clamp(1.4rem, 6vw, 7rem)', bottom: 'clamp(1.8rem, 8vh, 5rem)',
            opacity: info, transform: `translateY(${(1 - info) * 26}px)`,
            pointerEvents: info > 0.6 ? 'auto' : 'none',
          }}
        >
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: '.7rem', letterSpacing: '.4em', textTransform: 'uppercase', color: GOLD }}>
            465 Pineville Road · Newtown, PA · Bucks County
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '1rem 2.4rem', marginTop: '.8rem' }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 'clamp(2.6rem, 7vw, 6rem)', lineHeight: 0.95, letterSpacing: '-0.02em', color: '#FCFAF6', textShadow: '0 2px 34px rgba(10,8,6,.5)' }}>
              $18,800,000
            </div>
            <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 'clamp(1.05rem, 2.2vw, 1.5rem)', color: '#F0E7D6', textShadow: '0 1px 20px rgba(10,8,6,.6)' }}>
              4 beds · 6 baths · 8,050 sq ft · 147.73 acres
            </div>
          </div>
          <div style={{ marginTop: '1.7rem', display: 'flex', alignItems: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
            <Magnetic>
              <a
                href={DETAIL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block', fontFamily: FONT, fontWeight: 800, letterSpacing: '.24em', textTransform: 'uppercase', fontSize: '.74rem',
                  color: INK, background: '#FCFAF6', padding: '1.05rem 2.1rem', borderRadius: 999, textDecoration: 'none',
                  border: `1px solid ${GOLD}`, boxShadow: '0 16px 40px rgba(8,6,4,.42)',
                }}
              >
                View the estate ↗
              </a>
            </Magnetic>
            <span style={{ fontFamily: SERIF, fontStyle: 'italic', color: 'rgba(252,250,246,.85)', fontSize: '1rem', textShadow: '0 1px 16px rgba(10,8,6,.6)' }}>
              Chosen not for square footage, but for the life it makes possible.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
