import { Reveal, Line, Fade } from './ui';

/** Manifesto tipográfico escalonado (patrón Suffo) + ficha técnica del flagship. */
export default function Manifesto() {
  return (
    <section className="st st-light-s st-section">
      <div className="st-wrap">
        <Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(260px, 1fr)', gap: '3rem', alignItems: 'end' }} className="st-mani-grid">
            <h2 className="st-h1" style={{ margin: 0 }}>
              <Line i={0}>Quality</Line>
              <Line i={1} style={{ paddingLeft: '0.9em' }}><span className="st-dash">–</span>Trust</Line>
              <Line i={2}>Legacy</Line>
            </h2>
            <Fade i={3}>
              <span className="st-eyebrow">The flagship · Coming soon</span>
              <p className="st-body" style={{ marginTop: '1rem' }}>
                From a family of top-producing agents and investors, Andrea builds every sale on the
                same three foundations — and the flagship listing carries all of them.
              </p>
            </Fade>
          </div>
        </Reveal>

        <Reveal>
          <dl className="st-sheet" style={{ marginTop: '4.5rem' }}>
            <div><dt>Property</dt><dd>Pineville Estate</dd></div>
            <div><dt>Location</dt><dd>Newtown, PA</dd></div>
            <div><dt>Price</dt><dd className="st-num">$18.8M</dd></div>
            <div><dt>Beds / Baths</dt><dd className="st-num">4 / 6</dd></div>
            <div><dt>Total area</dt><dd className="st-num">147.73 ac</dd></div>
          </dl>
        </Reveal>
      </div>
      <style>{`@media (max-width: 860px){ .st-mani-grid{ grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}
