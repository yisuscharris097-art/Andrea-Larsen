'use client';
import React from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import Image from 'next/image';

/**
 * ParallaxHero — apertura cinematográfica estilo "FIND Real Estate".
 * Capas (mansión del desierto + niebla/nubes que driftean a distinta velocidad)
 * con push-in lento de la casa → sensación de "acercarse volando entre nubes".
 * Blanco + luxury (serif Cormorant, hairlines oro). Suavizado con useSpring.
 *
 * ▸ DRONE VIDEO: slot reservado y comentado abajo (se añade AL FINAL).
 */
export const ParallaxHero = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const sc = { stiffness: 110, damping: 30, mass: 0.6 };

  const houseScale = useSpring(useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.3]), sc);
  const houseY = useSpring(useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-7%']), sc);
  const cloudBackX = useSpring(useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '22%']), sc);
  const cloudBackScale = useSpring(useTransform(scrollYProgress, [0, 1], [1.1, reduce ? 1.1 : 1.6]), sc);
  const cloudFrontX = useSpring(useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-30%']), sc);
  const cloudFrontScale = useSpring(useTransform(scrollYProgress, [0, 1], [1.25, reduce ? 1.25 : 2]), sc);
  const cloudOpacity = useTransform(scrollYProgress, [0, 0.65, 1], [0.95, 0.55, 0]);
  const brandY = useSpring(useTransform(scrollYProgress, [0, 0.4], [0, reduce ? 0 : -50]), sc);
  const brandOpacity = useTransform(scrollYProgress, [0, 0.32, 0.46], [1, 1, 0]);
  const scrimOpacity = useTransform(scrollYProgress, [0, 1], [0.34, 0.62]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  return (
    <section ref={ref} className="relative h-[230vh] bg-paper">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0c0a08]">
        {/* BASE · mansión del desierto (push-in lento) */}
        <motion.div style={{ scale: houseScale, y: houseY }} className="absolute inset-0 will-change-transform">
          <Image src="/casa-hero.jpg" alt="Featured desert residence at dusk" fill priority sizes="100vw" className="object-cover object-center" />
        </motion.div>

        {/* ════════ DRONE VIDEO SLOT — se integra AL FINAL (no construir aún) ════════
            Reemplazará/complementará la imagen base con el clip de drone (Higgsfield):
        <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline preload="auto">
          <source src="/drone-reveal.mp4" type="video/mp4" />
        </video>
        ═══════════════════════════════════════════════════════════════════════════ */}

        {/* CAPAS ATMOSFÉRICAS · niebla/nubes que driftean a distinta velocidad */}
        <motion.div style={{ x: cloudBackX, scale: cloudBackScale, opacity: cloudOpacity }} className="absolute -inset-[15%] pointer-events-none will-change-transform" aria-hidden>
          <div className="h-full w-full blur-3xl [background:radial-gradient(38%_30%_at_18%_42%,rgba(255,255,255,0.92),transparent_70%),radial-gradient(32%_24%_at_72%_30%,rgba(255,255,255,0.85),transparent_72%),radial-gradient(40%_30%_at_52%_72%,rgba(255,255,255,0.8),transparent_72%)]" />
        </motion.div>
        <motion.div style={{ x: cloudFrontX, scale: cloudFrontScale, opacity: cloudOpacity }} className="absolute -inset-[25%] pointer-events-none will-change-transform" aria-hidden>
          <div className="h-full w-full blur-[60px] [background:radial-gradient(34%_26%_at_30%_60%,rgba(255,255,255,0.9),transparent_72%),radial-gradient(30%_22%_at_80%_55%,rgba(255,255,255,0.82),transparent_74%),radial-gradient(28%_22%_at_8%_30%,rgba(255,255,255,0.78),transparent_74%)]" />
        </motion.div>

        {/* SCRIM legibilidad + fundido inferior a blanco */}
        <motion.div style={{ opacity: scrimOpacity }} className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_42%,rgba(12,10,8,0.45),transparent_60%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[34%] pointer-events-none bg-gradient-to-b from-transparent to-paper" />

        {/* MARCA · serif de lujo */}
        <motion.div style={{ y: brandY, opacity: brandOpacity }} className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6">
          <span className="inline-flex items-center gap-3 text-white/85 uppercase tracking-[0.4em] text-[0.66rem] font-sans">
            <span className="w-8 h-px bg-gold" /> The Collection · Coming Soon <span className="w-8 h-px bg-gold" />
          </span>
          <h1 className="font-serif text-white font-medium leading-[0.95] tracking-[-0.01em] text-5xl md:text-8xl lg:text-[8.5rem] mt-6 [text-shadow:0_8px_40px_rgba(0,0,0,0.45)]">
            Love&nbsp;Living
            <br />
            <span className="italic">Coast2Coast</span>
          </h1>
          <p className="font-sans text-white/85 mt-7 text-sm md:text-lg tracking-[0.14em] uppercase">
            Helping You Love Where You Live
          </p>
        </motion.div>

        {/* SCROLL CUE */}
        <motion.div style={{ opacity: cueOpacity }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/70 text-[0.6rem] tracking-[0.3em] uppercase font-sans">
          Scroll
          <span className="w-px h-10 bg-gradient-to-b from-gold to-transparent" />
        </motion.div>
      </div>
    </section>
  );
};
