'use client';

/**
 * Collections — índice editorial negro (patrón Suffo): filas de propiedades,
 * hover = fila oliva + polaroid rotada que sigue al cursor. Titular partido
 * en dos esquinas. Lima solo aquí (sobre oscuro).
 */

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { properties } from '@/lib/properties';
import { Reveal, Line } from './ui';

export default function Collections() {
  const [hover, setHover] = useState(-1);
  const polRef = useRef<HTMLDivElement>(null);

  // el polaroid es fixed: si el usuario scrollea sin mover el mouse, se limpia
  useEffect(() => {
    const clear = () => setHover(-1);
    window.addEventListener('scroll', clear, { passive: true });
    return () => window.removeEventListener('scroll', clear);
  }, []);

  const onMove = (e: React.MouseEvent) => {
    const el = polRef.current;
    if (!el) return;
    el.style.left = `${Math.min(e.clientX + 26, window.innerWidth - 330)}px`;
    el.style.top = `${e.clientY - 120}px`;
  };

  return (
    <section className="st st-light-s st-section" id="collection" onMouseMove={onMove}>
      <div className="st-wrap">
        <Reveal>
          <span className="st-eyebrow">The collection</span>
          <h2 className="st-h1" style={{ margin: '1.2rem 0 0.4em' }}>
            <Line i={0}>Live where</Line>
          </h2>
        </Reveal>

        <Reveal>
          <div role="list">
            {properties.map((p, i) => (
              <Link
                key={p.slug}
                role="listitem"
                className="st-row"
                href={`/listing/${p.slug}`}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(-1)}
              >
                <span className="r-name">{p.address}</span>
                <span className="r-loc">{p.city}, {p.state} · {p.status}</span>
                <span className="r-size">{p.sqft ? `${p.sqft.toLocaleString('en-US')} Sq Ft` : p.beds ? `${p.beds} BD / ${p.baths} BA` : `${p.lotAcres} Acres`}</span>
              </Link>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <h2 className="st-h1" style={{ margin: '0.5em 0 0', textAlign: 'right' }}>
            <Line i={0}><span className="st-dash">–</span>you <span className="st-it">love.</span></Line>
          </h2>
        </Reveal>
      </div>

      {/* polaroid flotante */}
      <div ref={polRef} className={`st-polaroid${hover >= 0 ? ' on' : ''}`} aria-hidden>
        {hover >= 0 && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={properties[hover].photo} alt="" />
        )}
      </div>
    </section>
  );
}
