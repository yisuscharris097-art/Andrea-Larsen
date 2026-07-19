import { Reveal, Line, Fade } from './ui';
import HomeMap from './home-map';

/** Mapa interactivo real (MapLibre, paleta del sitio) + copy editorial. */
export default function MapSection() {
  return (
    <section className="st st-light-s st-section">
      <div className="st-wrap st-map-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.2fr) minmax(0, 1fr)', gap: '3.5rem', alignItems: 'center' }}>
        <Reveal>
          <HomeMap />
        </Reveal>

        <Reveal>
          <span className="st-eyebrow">Where she works</span>
          <h2 className="st-h2" style={{ margin: '1rem 0 1.4rem' }}>
            <Line i={0}>Discover properties</Line>
            <Line i={1}>with the <span className="st-it">best</span> value</Line>
          </h2>
          <Fade i={2}>
            <p className="st-body">
              Beach blocks, bayfronts and boardwalk-close cottages — Andrea covers Ocean City and
              the Jersey Shore, licensed in New Jersey, Florida and Arizona.
            </p>
          </Fade>
          <Fade i={3}>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '2rem' }}>
              <a className="st-pill st-pill--solid" href="/properties?view=map">
                Explore the full map →
              </a>
              <a className="st-pill st-pill--dark" href="/properties">
                Browse listings
              </a>
            </div>
          </Fade>
        </Reveal>
      </div>
      <style>{`@media (max-width: 900px){ .st-map-grid{ grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}
