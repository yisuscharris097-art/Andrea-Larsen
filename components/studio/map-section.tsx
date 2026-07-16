import { Reveal, Line, Fade } from './ui';

/** Mapa estilizado desaturado (SVG propio) + pin custom + chip flotante. */
export default function MapSection() {
  return (
    <section className="st st-light-s st-section">
      <div className="st-wrap st-map-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(0, 1fr)', gap: '3.5rem', alignItems: 'center' }}>
        <Reveal>
          <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', background: '#e9eae6', aspectRatio: '4/3' }}>
            <svg viewBox="0 0 640 480" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden>
              <rect width="640" height="480" fill="#EDEEEA" />
              <g stroke="#D7D9D2" strokeWidth="10" fill="none">
                <path d="M-20 120 C160 90 300 170 660 130" />
                <path d="M-20 300 C200 280 420 330 660 290" />
                <path d="M120 -20 C140 160 90 320 130 500" />
                <path d="M380 -20 C360 180 420 340 390 500" />
              </g>
              <g stroke="#C9D8B9" strokeWidth="4" fill="none" opacity="0.9">
                <path d="M-20 200 C180 180 340 240 660 210" />
                <path d="M240 -20 C230 160 260 340 250 500" />
                <path d="M520 -20 C500 200 560 320 530 500" />
              </g>
              <g fill="#DFE2DA">
                <rect x="60" y="60" width="90" height="46" rx="8" />
                <rect x="440" y="330" width="120" height="60" rx="8" />
                <rect x="300" y="70" width="60" height="60" rx="8" />
                <rect x="80" y="350" width="100" height="52" rx="8" />
              </g>
            </svg>
            {/* pin custom */}
            <div style={{ position: 'absolute', left: '48%', top: '44%', transform: 'translate(-50%, -100%)' }}>
              <div style={{ width: 64, height: 64, borderRadius: 999, background: 'rgba(227,193,115,0.45)', display: 'grid', placeItems: 'center' }}>
                <div style={{ width: 34, height: 34, borderRadius: 999, background: '#0d0d0d', display: 'grid', placeItems: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#E3C173" strokeWidth="1.6" aria-hidden><path d="M3 10l7-6 7 6M5 9v7h10V9M8.5 16v-4h3v4" /></svg>
                </div>
              </div>
            </div>
            <div style={{ position: 'absolute', left: '48%', top: '48%', transform: 'translateX(-20%)', background: '#fff', borderRadius: 999, padding: '0.55em 1.2em', fontFamily: 'var(--body)', fontSize: '0.85rem', fontWeight: 500, boxShadow: '0 12px 30px rgba(20,22,18,.18)' }}>
              Dream home, found
            </div>
          </div>
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
            <a className="st-pill st-pill--solid" style={{ marginTop: '2rem' }} href="/properties" >
              Find nearest properties →
            </a>
          </Fade>
        </Reveal>
      </div>
      <style>{`@media (max-width: 900px){ .st-map-grid{ grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}
