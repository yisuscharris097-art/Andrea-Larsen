'use client';

/**
 * Magnetic — physics-style magnetic hover (Awwwards Pack / Physics 3, ported).
 * Children drift toward the cursor inside the hover zone and spring back on leave.
 * Inert on touch devices and under prefers-reduced-motion.
 */

import { useRef } from 'react';

export default function Magnetic({ children, strength = 0.32 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.transition = 'transform 120ms ease-out';
    el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)';
    el.style.transform = 'translate(0, 0)';
  };

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ display: 'inline-block', willChange: 'transform' }}>
      {children}
    </div>
  );
}
