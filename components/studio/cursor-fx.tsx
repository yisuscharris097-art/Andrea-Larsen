'use client';

/**
 * CursorFX — cursor contextual (solo desktop con puntero fino) + skew de
 * imágenes por velocidad de scroll. El dot sigue al mouse con lerp y muta
 * según data-cursor del elemento bajo el puntero: "View →" en cards,
 * "Drag" en carruseles, "+" en galería. Reduced-motion: nada de esto.
 */

import { useEffect, useRef } from 'react';

export default function CursorFX() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;

    const dot = dotRef.current!;
    let mx = -100, my = -100, x = -100, y = -100, raf = 0;
    let label = '';

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      const t = (e.target as HTMLElement)?.closest?.('[data-cursor]') as HTMLElement | null;
      const next = t?.dataset.cursor || '';
      if (next !== label) {
        label = next;
        dot.textContent = label;
        dot.style.width = label ? '74px' : '10px';
        dot.style.height = label ? '74px' : '10px';
        dot.style.background = label ? 'rgba(78,42,79,0.92)' : 'rgba(78,42,79,0.85)';
      }
    };

    // skew por velocidad de scroll → CSS var consumida por las imágenes de grids
    let lastY = window.scrollY, skew = 0;
    const loop = () => {
      x += (mx - x) * 0.18;
      y += (my - y) * 0.18;
      dot.style.transform = `translate(${x - (label ? 37 : 5)}px, ${y - (label ? 37 : 5)}px)`;
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      const target = Math.max(-2, Math.min(2, dy * 0.06));
      skew += (target - skew) * 0.12;
      document.documentElement.style.setProperty('--scroll-skew', `${skew.toFixed(3)}deg`);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', onMove); };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden
      style={{
        position: 'fixed', left: 0, top: 0, zIndex: 200, width: 10, height: 10,
        borderRadius: 999, background: 'rgba(78,42,79,0.85)', color: '#fff',
        display: 'grid', placeItems: 'center', pointerEvents: 'none',
        fontFamily: 'var(--body)', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.04em',
        transition: 'width 250ms var(--ease-o), height 250ms var(--ease-o), background 250ms var(--ease)',
        mixBlendMode: 'normal', willChange: 'transform',
      }}
    />
  );
}
