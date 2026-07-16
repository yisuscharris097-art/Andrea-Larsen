'use client';

/**
 * Studio UI primitives — mask reveal, viewport fade, count-up.
 * IO-driven, CSS-transition powered (see app/studio.css), reduced-motion safe.
 */

import { useEffect, useRef } from 'react';

/** Adds .in when the element enters the viewport (once). */
export function Reveal({ children, className = '', as: Tag = 'div' }: { children: React.ReactNode; className?: string; as?: any }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.classList.add('in'); return; }
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <Tag ref={ref} className={`st-reveal ${className}`}>{children}</Tag>;
}

/** One masked line of a display title. Pass i for stagger order. */
export function Line({ children, i = 0, style }: { children: React.ReactNode; i?: number; style?: React.CSSProperties }) {
  return (
    <span className="st-line" style={style}>
      <span style={{ ['--i' as any]: i }}>{children}</span>
    </span>
  );
}

/** Fade+rise child, staggered by i, activated by a parent <Reveal>. */
export function Fade({ children, i = 0, className = '', style }: { children: React.ReactNode; i?: number; className?: string; style?: React.CSSProperties }) {
  return <div className={`st-fade ${className}`} style={{ ...style, ['--i' as any]: i }}>{children}</div>;
}

/** Animated number that counts up when visible. Keeps suffix/prefix static. */
export function CountUp({ to, prefix = '', suffix = '' }: { to: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = prefix + to.toLocaleString('en-US') + suffix; return; }
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (!e.isIntersecting) return; io.unobserve(e.target);
        const t0 = performance.now(), dur = 1300;
        const step = (t: number) => {
          const p = Math.min(1, (t - t0) / dur);
          el.textContent = prefix + Math.round(to * (1 - Math.pow(1 - p, 3))).toLocaleString('en-US') + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, [to, prefix, suffix]);
  return <span ref={ref}>{prefix}0{suffix}</span>;
}
