'use client';

/**
 * ScrollExpandRealEstate — UN SOLO componente, autónomo y portable.
 * Hero cinematográfico "scroll-to-expand" para un listing de lujo:
 * el media crece con el scroll, el título se separa, y al expandirse
 * se revela el detalle de la propiedad.
 *
 * ▸ Funciona en FRAMER (code component) y en NEXT.js / VERCEL.
 * ▸ Sin Tailwind, sin next/image — solo React + framer-motion + estilos inline.
 * ▸ Paleta del proyecto: blanco cálido + tinta + OXBLOOD. Sans pesada (Archivo).
 *
 * Uso mínimo:  <ScrollExpandRealEstate />
 * (trae por defecto la propiedad flagship 465 Pineville Rd, $18.8M)
 */

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export interface ScrollExpandRealEstateProps {
  mediaSrc?: string;
  bgImageSrc?: string;
  brand?: string;
  title?: string;          // se parte en dos líneas que se separan
  eyebrow?: string;
  price?: string;
  address?: string;
  location?: string;
  beds?: number;
  baths?: number;
  sqft?: number;
  acres?: number;
  scrollToExpand?: string;
  statement?: string;      // frase de manifiesto que se revela
  accentWords?: string;    // palabras a colorear en oxblood (separadas por |)
  ctaLabel?: string;
  ctaHref?: string;
  ink?: string;
  paper?: string;
  oxblood?: string;
}

const FLAGSHIP = 'https://content.mediastg.net/dyna_images/mls/105605/5739864.jpg';
const FONT = "'Archivo', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif";

export default function ScrollExpandRealEstate({
  mediaSrc = FLAGSHIP,
  bgImageSrc = FLAGSHIP,
  brand = 'Love Living Coast2Coast',
  title = 'Pineville Estate',
  eyebrow = 'Flagship Residence · Coming Soon',
  price = '$18,800,000',
  address = '465 Pineville Road',
  location = 'Newtown, PA · Bucks County',
  beds = 4,
  baths = 6,
  sqft = 8050,
  acres = 147.73,
  scrollToExpand = 'Scroll to expand',
  statement = 'Chosen not for square footage, but for the life it makes possible.',
  accentWords = 'life|possible.',
  ctaLabel = 'Schedule a private viewing',
  ctaHref = '#',
  ink = '#1a1714',
  paper = '#faf9f7',
  oxblood = '#7a1f1b',
}: ScrollExpandRealEstateProps) {
  const [progress, setProgress] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const touchY = useRef(0);

  // Auto-carga la fuente Archivo (autónomo en web/Vercel; en Framer usa su fallback)
  useEffect(() => {
    const id = 'sere-archivo';
    if (typeof document !== 'undefined' && !document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setProgress(1);
      setExpanded(true);
      setShowContent(true);
      return;
    }

    const advance = (delta: number) => {
      setProgress((prev) => {
        const np = Math.min(Math.max(prev + delta, 0), 1);
        if (np >= 1) {
          setExpanded(true);
          setShowContent(true);
        } else if (np < 0.75) {
          setShowContent(false);
        }
        return np;
      });
    };

    const onWheel = (e: WheelEvent) => {
      if (expanded && e.deltaY < 0 && window.scrollY <= 5) {
        setExpanded(false);
        e.preventDefault();
      } else if (!expanded) {
        e.preventDefault();
        advance(e.deltaY * 0.0009);
      }
    };
    const onTouchStart = (e: TouchEvent) => {
      touchY.current = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!touchY.current) return;
      const dy = touchY.current - e.touches[0].clientY;
      if (expanded && dy < -20 && window.scrollY <= 5) {
        setExpanded(false);
        e.preventDefault();
      } else if (!expanded) {
        e.preventDefault();
        advance(dy * (dy < 0 ? 0.008 : 0.005));
        touchY.current = e.touches[0].clientY;
      }
    };
    const onTouchEnd = () => {
      touchY.current = 0;
    };
    const onScroll = () => {
      if (!expanded) window.scrollTo(0, 0);
    };
    const onKey = (e: KeyboardEvent) => {
      if (!expanded && ['ArrowDown', 'PageDown', ' ', 'Spacebar', 'End'].includes(e.key)) {
        e.preventDefault();
        advance(0.12);
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('scroll', onScroll);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKey);
    };
  }, [expanded]);

  const mediaWidth = 300 + progress * (isMobile ? 650 : 1250);
  const mediaHeight = 400 + progress * (isMobile ? 200 : 400);
  const tx = progress * (isMobile ? 180 : 150);
  const [firstWord, ...restArr] = title.split(' ');
  const restWord = restArr.join(' ');
  const accent = new Set(accentWords.split('|').filter(Boolean));
  const titleFade = 1 - Math.min(1, Math.max(0, (progress - 0.55) / 0.45));

  const Spec = ({ v, k, first }: { v: string | number; k: string; first?: boolean }) => (
    <span
      style={{
        position: 'relative',
        padding: first ? '0 1.1rem 0 0' : '0 1.1rem',
        fontSize: '.8rem',
        letterSpacing: '.1em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,.82)',
        whiteSpace: 'nowrap',
      }}
    >
      {!first && (
        <span
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 1,
            height: '.9rem',
            background: 'rgba(255,255,255,.34)',
          }}
        />
      )}
      <b style={{ color: '#fff', fontWeight: 700 }}>{v}</b> {k}
    </span>
  );

  return (
    <div style={{ overflowX: 'hidden', background: paper, color: ink, fontFamily: FONT }}>
      <section
        style={{
          position: 'relative',
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        {/* Fondo full-bleed que se desvanece al expandir */}
        <motion.div
          style={{ position: 'absolute', inset: 0, zIndex: 0 }}
          animate={{ opacity: 1 - progress }}
          transition={{ duration: 0.1 }}
        >
          <img
            src={bgImageSrc}
            alt=""
            style={{ width: '100vw', height: '100vh', objectFit: 'cover', objectPosition: 'center' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(12,9,7,.30)' }} />
        </motion.div>

        <div style={{ position: 'relative', zIndex: 10, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100dvh',
              position: 'relative',
            }}
          >
            {/* Media que se expande */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%,-50%)',
                width: `${mediaWidth}px`,
                height: `${mediaHeight}px`,
                maxWidth: '95vw',
                maxHeight: '85vh',
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 40px 90px -30px rgba(0,0,0,.6)',
                zIndex: 0,
              }}
            >
              <img src={mediaSrc} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <motion.div
                style={{ position: 'absolute', inset: 0, background: 'rgb(12,9,7)' }}
                animate={{ opacity: 0.55 - progress * 0.4 }}
                transition={{ duration: 0.2 }}
              />
              {/* Overlay del flagship (aparece al expandir) */}
              <motion.div
                animate={{ opacity: showContent ? 1 : 0 }}
                transition={{ duration: 0.6 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: 'clamp(1.4rem,4vw,3rem)',
                  pointerEvents: showContent ? 'auto' : 'none',
                }}
              >
                <span style={{ fontSize: '.72rem', letterSpacing: '.26em', textTransform: 'uppercase', fontWeight: 700, color: '#fff' }}>
                  {eyebrow}
                </span>
                <div style={{ fontWeight: 800, letterSpacing: '-.03em', lineHeight: 0.95, fontSize: 'clamp(2.4rem,7vw,6rem)', color: '#fff', margin: '.4rem 0 .3rem' }}>
                  {price}
                </div>
                <div style={{ fontSize: 'clamp(1rem,2vw,1.4rem)', fontWeight: 600, color: '#fff' }}>{address}</div>
                <div style={{ color: 'rgba(255,255,255,.8)', marginBottom: '1.2rem', fontSize: '.95rem' }}>{location}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', rowGap: '.6rem' }}>
                  <Spec v={beds} k="Beds" first />
                  <Spec v={baths} k="Baths" />
                  <Spec v={sqft.toLocaleString('en-US')} k="Sq Ft" />
                  <Spec v={acres} k="Acres" />
                </div>
              </motion.div>
            </div>

            {/* Título que se separa */}
            <motion.div
              animate={{ opacity: titleFade }}
              transition={{ duration: 0.1 }}
              style={{
                position: 'relative',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                mixBlendMode: 'difference',
                gap: '.3rem',
                pointerEvents: 'none',
              }}
            >
              <span style={{ fontWeight: 800, letterSpacing: '-.03em', fontSize: 'clamp(2.6rem,9vw,7rem)', color: '#fff', transform: `translateX(-${tx}vw)` }}>
                {firstWord}
              </span>
              <span style={{ fontWeight: 800, letterSpacing: '-.03em', fontSize: 'clamp(2.6rem,9vw,7rem)', color: '#fff', transform: `translateX(${tx}vw)` }}>
                {restWord}
              </span>
            </motion.div>

            {/* Pista de scroll */}
            <motion.div
              animate={{ opacity: 1 - Math.min(1, progress / 0.4) }}
              transition={{ duration: 0.1 }}
              style={{
                position: 'absolute',
                bottom: '2rem',
                zIndex: 10,
                color: 'rgba(255,255,255,.82)',
                fontSize: '.66rem',
                letterSpacing: '.28em',
                textTransform: 'uppercase',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '.6rem',
                pointerEvents: 'none',
              }}
            >
              <span>{scrollToExpand}</span>
              <span style={{ width: 1, height: '2.4rem', background: `linear-gradient(${oxblood}, transparent)` }} />
            </motion.div>
          </div>

          {/* Contenido revelado */}
          <motion.section
            animate={{ opacity: showContent ? 1 : 0 }}
            transition={{ duration: 0.7 }}
            style={{ width: '100%', maxWidth: 1100, margin: '0 auto', padding: 'clamp(3rem,10vh,8rem) clamp(1.25rem,5vw,4rem)' }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '.7rem', fontSize: '.72rem', letterSpacing: '.26em', textTransform: 'uppercase', fontWeight: 700, color: oxblood }}>
              <span style={{ width: '2rem', height: 1, background: oxblood }} /> The Flagship
            </span>
            <p style={{ fontWeight: 700, fontSize: 'clamp(1.6rem,4.4vw,3.4rem)', lineHeight: 1.14, letterSpacing: '-.02em', margin: '1.4rem 0 0', maxWidth: '20ch' }}>
              {statement.split(' ').map((word, i) => {
                const acc = accent.has(word) || accent.has(word.replace(/[.,;:]/g, ''));
                return (
                  <span key={i} style={{ color: acc ? oxblood : ink }}>
                    {word}{' '}
                  </span>
                );
              })}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.6rem', marginTop: '2.4rem', alignItems: 'center' }}>
              <a
                href={ctaHref}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '.6rem', padding: '1rem 1.8rem', borderRadius: 500, background: oxblood, color: '#fff', fontWeight: 700, fontSize: '.76rem', letterSpacing: '.12em', textTransform: 'uppercase', textDecoration: 'none' }}
              >
                {ctaLabel} <span aria-hidden>→</span>
              </a>
              <span style={{ color: '#8d877b', fontSize: '.92rem' }}>
                <b style={{ color: ink, fontWeight: 700 }}>{brand}</b>
              </span>
            </div>
          </motion.section>
        </div>
      </section>
    </div>
  );
}

/* ── (Opcional) Controles de Framer ──────────────────────────────
   Si lo usas en FRAMER y quieres editar props desde el panel,
   descomenta esto (solo funciona dentro de Framer, NO en Vercel):

import { addPropertyControls, ControlType } from 'framer';
addPropertyControls(ScrollExpandRealEstate, {
  title:    { type: ControlType.String, defaultValue: 'Pineville Estate' },
  price:    { type: ControlType.String, defaultValue: '$18,800,000' },
  address:  { type: ControlType.String, defaultValue: '465 Pineville Road' },
  mediaSrc: { type: ControlType.Image },
  bgImageSrc:{ type: ControlType.Image },
  oxblood:  { type: ControlType.Color, defaultValue: '#7a1f1b' },
});
──────────────────────────────────────────────────────────────── */
