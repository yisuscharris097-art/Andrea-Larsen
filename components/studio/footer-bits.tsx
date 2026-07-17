'use client';

/**
 * Footer bits — wordmark que entra letra por letra desde abajo + hora local
 * de Ocean City en vivo (America/New_York).
 */

import { useEffect, useRef, useState } from 'react';

export function WordmarkReveal({ text = 'andrea' }: { text?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.classList.add('in'); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { el.classList.add('in'); io.disconnect(); } }), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <span ref={ref} className="st-wordmark st-wordmark-letters" style={{ textAlign: 'center' }}>
      {text.split('').map((ch, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
          <span style={{ display: 'inline-block', transform: 'translateY(105%)', transition: `transform 700ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 55}ms` }}>{ch}</span>
        </span>
      ))}
    </span>
  );
}

export function LocalClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => setTime(new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' }).format(new Date()));
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>Ocean City, NJ — {time || '·'}</span>;
}
