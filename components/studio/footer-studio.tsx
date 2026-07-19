import { agent } from '@/components/agent-data';
import { WordmarkReveal, LocalClock } from './footer-bits';
import { Reveal, Line, Fade } from './ui';

/** CTA final + footer negro con wordmark lima cortado por el borde (patrón Suffo). */
export default function FooterStudio() {
  return (
    <footer className="st st-light-s" style={{ overflow: 'hidden', borderTop: '1px solid var(--st-line)' }}>
      <div className="st-section" style={{ paddingBottom: '3rem' }}>
        <div className="st-wrap" style={{ textAlign: 'center' }}>
          <Reveal>
            <span className="st-eyebrow" style={{ justifyContent: 'center' }}>Quality // Trust // Legacy</span>
            <h2 className="st-h1" style={{ margin: '1.2rem 0 0' }}>
              <Line i={0}>Love where</Line>
              <Line i={1}><span className="st-it">you</span> live<span className="st-dash">.</span></Line>
            </h2>
            <Fade i={2}>
              <div style={{ marginTop: '2.6rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <a className="st-pill st-pill--solid" style={{ fontWeight: 600 }} href={agent.contact.calendly} target="_blank" rel="noopener noreferrer">
                  Schedule a private viewing
                </a>
                <a className="st-pill st-pill--dark" href={`tel:${agent.contact.phone}`}>{agent.contact.phone}</a>
              </div>
            </Fade>
          </Reveal>

          <Reveal>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '2rem', textAlign: 'left', marginTop: '5.5rem', paddingTop: '2.2rem', borderTop: '1px solid var(--st-line)', fontSize: '0.8rem', color: 'var(--st-grey)' }}>
              <div>
                ALL RIGHTS RESERVED.<br />©2026 {agent.name.toUpperCase()}<br /><LocalClock />
              </div>
              <div style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {agent.office.name}<br />{agent.office.address}<br />Equal Housing Opportunity · NJ · FL · AZ
              </div>
              <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap' }}>
                <a href="/properties" style={{ color: 'var(--st-ink)', textDecoration: 'none' }}>PROPERTIES</a>
                <a href="/collection" style={{ color: 'var(--st-ink)', textDecoration: 'none' }}>COLLECTION</a>
                <a href="/sell" style={{ color: 'var(--st-ink)', textDecoration: 'none' }}>SELL</a>
                <a href="/about" style={{ color: 'var(--st-ink)', textDecoration: 'none' }}>ABOUT</a>
                <a href="/testimonials" style={{ color: 'var(--st-ink)', textDecoration: 'none' }}>REVIEWS</a>
                <a href="/blog" style={{ color: 'var(--st-ink)', textDecoration: 'none' }}>JOURNAL</a>
                <a href="/neighborhoods/ocean-city" style={{ color: 'var(--st-ink)', textDecoration: 'none' }}>OCEAN CITY</a>
              </div>
              <div style={{ display: 'flex', gap: '1.6rem' }}>
                <a href={agent.social.Instagram} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--st-ink)', textDecoration: 'none' }}>INSTAGRAM</a>
                <a href={agent.social.LinkedIn} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--st-ink)', textDecoration: 'none' }}>LINKEDIN</a>
                <a href={agent.social.YouTube} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--st-ink)', textDecoration: 'none' }}>YOUTUBE</a>
              </div>
              <div>
                <a href={`mailto:${agent.contact.email}`} style={{ color: '#4E2A4F', textDecoration: 'none', fontWeight: 500 }}>{agent.contact.email}</a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* wordmark gigante, letra a letra, cortado por el borde inferior */}
      <div aria-hidden style={{ overflow: 'hidden', lineHeight: 0, textAlign: 'center' }}>
        <WordmarkReveal />
      </div>
    </footer>
  );
}
