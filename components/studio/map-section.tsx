import Link from 'next/link';
import { Reveal, Line, Fade } from './ui';
import HomeMap from './home-map';
import { properties } from '@/lib/properties';

const size = (p: (typeof properties)[number]) =>
  p.sqft ? `${p.sqft.toLocaleString('en-US')} sq ft`
    : p.beds ? `${p.beds} BD / ${p.baths} BA`
      : p.lotAcres ? `${p.lotAcres} ac`
        : p.type === 'Land' ? 'Land' : 'Multi-unit';

/** Mapa interactivo real (MapLibre) + The Collection fusionada: la lista de
 *  inventario vive junto al mapa en vez de repetirse como sección aparte. */
export default function MapSection() {
  const list = properties.slice(0, 8);
  return (
    <section className="st st-light-s st-section">
      <div className="st-wrap st-map-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.2fr) minmax(0, 1fr)', gap: '3.5rem', alignItems: 'start' }}>
        <Reveal>
          <HomeMap />
        </Reveal>

        <Reveal>
          <span className="st-eyebrow">The collection · Where she works</span>
          <h2 className="st-h2" style={{ margin: '1rem 0 1.4rem' }}>
            <Line i={0}>Discover properties</Line>
            <Line i={1}>with the <span className="st-it">best</span> value</Line>
          </h2>
          <Fade i={2}>
            <div className="hm-list">
              {list.map((p) => (
                <Link key={p.slug} href={`/listing/${p.slug}`} className="hm-row" data-cursor="View →" data-curtain={p.address}>
                  <span>
                    <span className="a" style={{ display: 'block' }}>{p.address}</span>
                    <span className="c">{p.city}, {p.state} · {p.status}</span>
                  </span>
                  <span className="s">{size(p)}</span>
                </Link>
              ))}
            </div>
          </Fade>
          <Fade i={3}>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '1.8rem' }}>
              <a className="st-pill st-pill--solid" href="/properties">
                See all {properties.length} properties →
              </a>
              <a className="st-pill st-pill--dark" href="/properties?view=map">
                Open the map
              </a>
            </div>
          </Fade>
        </Reveal>
      </div>
      <style>{`@media (max-width: 900px){ .st-map-grid{ grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}
