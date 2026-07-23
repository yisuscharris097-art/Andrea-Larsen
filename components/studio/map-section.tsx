'use client';

/** MapSection — mapa STICKY + The Collection scrolleando al lado (patrón
 *  Zillow/Redfin). El mapa se queda fijo mientras la lista pasa; hover
 *  bidireccional fila ↔ pin. Elimina el hueco blanco de la altura fija. */
import Link from 'next/link';
import { useState } from 'react';
import { properties } from '@/lib/properties';
import PropertiesMap from './properties-map';
import { Reveal, Line, Fade } from './ui';

const size = (p: (typeof properties)[number]) =>
  p.sqft ? `${p.sqft.toLocaleString('en-US')} sq ft`
    : p.beds ? `${p.beds} BD / ${p.baths} BA`
      : p.lotAcres ? `${p.lotAcres} ac`
        : p.type === 'Land' ? 'Land' : 'Multi-unit';

export default function MapSection() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="st st-light-s st-section">
      <div className="st-wrap mc-grid">
        {/* mapa sticky */}
        <div className="mc-mapcol">
          <div className="mc-map">
            <PropertiesMap results={properties} hoveredSlug={hovered} onPinHover={setHovered} />
          </div>
        </div>

        {/* lista scrolleable */}
        <div>
          <Reveal>
            <span className="st-eyebrow">The collection · Where she works</span>
            <h2 className="mc-title" style={{ margin: '0.9rem 0 0.4rem' }}>
              <Line i={0}>Discover properties</Line>
              <Line i={1}>with the <span className="st-it">best</span> value</Line>
            </h2>
            <Fade i={2}>
              <p className="st-body" style={{ margin: '1rem 0 1.6rem' }}>
                {properties.length} residences across Ocean City and the Jersey Shore. Hover a home to
                find it on the map.
              </p>
            </Fade>
          </Reveal>

          <div className="hm-list">
            {properties.map((p) => (
              <Link
                key={p.slug}
                href={`/listing/${p.slug}`}
                className={`hm-row${hovered === p.slug ? ' hot' : ''}`}
                data-curtain={p.address}
                onMouseEnter={() => setHovered(p.slug)}
                onMouseLeave={() => setHovered(null)}
              >
                <span>
                  <span className="a" style={{ display: 'block' }}>{p.address}</span>
                  <span className="c">{p.city}, {p.state} · {p.status}</span>
                </span>
                <span className="s">{size(p)}</span>
              </Link>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '1.8rem' }}>
            <a className="st-pill st-pill--solid" href="/properties">See all {properties.length} properties →</a>
            <a className="st-pill st-pill--dark" href="/properties?view=map">Open the full map</a>
          </div>
        </div>
      </div>
    </section>
  );
}
