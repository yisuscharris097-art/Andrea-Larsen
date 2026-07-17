'use client';

/**
 * Curtain — transición de página con cortina: intercepta clicks en enlaces
 * internos [data-curtain], barre un panel ciruela con clip-path mostrando el
 * nombre del destino, navega, y revela la nueva ruta. Reduced-motion: navega
 * directo sin cortina.
 */

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function Curtain() {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<'idle' | 'in' | 'out'>('idle');
  const [label, setLabel] = useState('');
  const pending = useRef<string | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.('a[data-curtain]') as HTMLAnchorElement | null;
      if (!a || e.metaKey || e.ctrlKey || a.target === '_blank') return;
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('/')) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; // Link navega normal
      e.preventDefault();
      pending.current = href;
      setLabel(a.dataset.curtain || '');
      setState('in');
      setTimeout(() => router.push(href), 480);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [router]);

  // al cambiar la ruta, revelar
  useEffect(() => {
    if (state === 'in' && pending.current && pathname === pending.current.split('?')[0]) {
      pending.current = null;
      const t = setTimeout(() => { setState('out'); setTimeout(() => setState('idle'), 620); }, 60);
      return () => clearTimeout(t);
    }
  }, [pathname, state]);

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed', inset: 0, zIndex: 300, background: '#4E2A4F',
        display: 'grid', placeItems: 'center', pointerEvents: state === 'idle' ? 'none' : 'auto',
        clipPath: state === 'in' ? 'inset(0 0 0 0)' : state === 'out' ? 'inset(0 0 100% 0)' : 'inset(100% 0 0 0)',
        transition: state === 'idle' ? 'none' : 'clip-path 560ms cubic-bezier(0.76, 0, 0.24, 1)',
      }}
    >
      <span style={{ fontFamily: 'var(--grotesk)', fontWeight: 500, fontStretch: '115%', fontSize: 'clamp(1.6rem, 4vw, 3rem)', letterSpacing: '-0.02em', color: '#F4F4F2', opacity: state === 'in' ? 1 : 0, transition: 'opacity 300ms var(--ease)' }}>
        {label}
      </span>
    </div>
  );
}
