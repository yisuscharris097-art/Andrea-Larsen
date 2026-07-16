'use client';

/**
 * Finale — quiet, confident closing band: brand line, magnetic CTA and
 * direct contact. Paper background, gold hairline, oxblood action.
 */

import Magnetic from './magnetic';

const INK = '#1A1714';
const OXBLOOD = '#7A1F1B';
const GOLD = '#C8A45D';
const PAPER = '#FAF9F7';
const FONT = "'Archivo', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif";
const SERIF = "'Cormorant Garamond', Georgia, serif";

export default function Finale() {
  return (
    <section aria-label="Contact Andrea Larsen" style={{ background: PAPER, padding: 'clamp(6rem, 14vh, 10rem) clamp(1.4rem, 6vw, 7rem)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        <div aria-hidden style={{ width: 72, height: 1, background: GOLD, margin: '0 auto 2.4rem' }} />
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: '.72rem', letterSpacing: '.42em', textTransform: 'uppercase', color: OXBLOOD }}>
          Love Living Coast2Coast
        </div>
        <h2 style={{ fontFamily: FONT, fontWeight: 900, fontSize: 'clamp(2.6rem, 8vw, 6.4rem)', lineHeight: 0.98, letterSpacing: '-0.02em', textTransform: 'uppercase', color: INK, margin: '1.4rem 0 0' }}>
          Love where <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 600, textTransform: 'none', color: OXBLOOD }}>you live.</span>
        </h2>
        <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 'clamp(1.1rem, 2.4vw, 1.5rem)', color: 'rgba(26,23,20,.62)', margin: '1.6rem auto 3rem', maxWidth: 620 }}>
          27 years, three states, and one promise — a real estate experience worthy of the home itself.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.4rem', flexWrap: 'wrap' }}>
          <Magnetic>
            <a
              href="https://calendly.com/andrealarsen"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block', fontFamily: FONT, fontWeight: 800, letterSpacing: '.24em', textTransform: 'uppercase', fontSize: '.76rem',
                color: '#FCFAF6', background: OXBLOOD, padding: '1.15rem 2.6rem', borderRadius: 999, textDecoration: 'none',
                border: `1px solid ${GOLD}`, boxShadow: '0 20px 48px -18px rgba(122,31,27,.55)',
              }}
            >
              Schedule a private viewing
            </a>
          </Magnetic>
          <a href="tel:5618883494" style={{ fontFamily: FONT, fontWeight: 700, fontSize: '.85rem', letterSpacing: '.08em', color: INK, textDecoration: 'none', borderBottom: `1px solid ${GOLD}`, paddingBottom: 2 }}>
            561-888-3494
          </a>
        </div>
        <div style={{ marginTop: '3.4rem', fontFamily: FONT, fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(26,23,20,.4)' }}>
          Andrea Larsen · REALTOR® · Berkshire Hathaway HomeServices Fox &amp; Roach · AZ · FL · NJ
        </div>
      </div>
    </section>
  );
}
