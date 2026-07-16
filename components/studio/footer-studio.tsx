import { agent } from '@/components/agent-data';
import { Reveal, Line, Fade } from './ui';

/** CTA final + footer negro con wordmark lima cortado por el borde (patrón Suffo). */
export default function FooterStudio() {
  return (
    <footer className="st st-dark-s" style={{ overflow: 'hidden' }}>
      <div className="st-section" style={{ paddingBottom: '3rem' }}>
        <div className="st-wrap" style={{ textAlign: 'center' }}>
          <Reveal>
            <span className="st-eyebrow" style={{ color: '#8a8a8a', justifyContent: 'center' }}>Quality // Trust // Legacy</span>
            <h2 className="st-h1" style={{ margin: '1.2rem 0 0' }}>
              <Line i={0}>Love where</Line>
              <Line i={1}><span className="st-it">you</span> live<span className="st-dash">.</span></Line>
            </h2>
            <Fade i={2}>
              <div style={{ marginTop: '2.6rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <a className="st-pill" style={{ background: 'var(--st-lime)', color: 'var(--st-dark)', borderColor: 'var(--st-lime)', fontWeight: 600 }} href={agent.contact.calendly} target="_blank" rel="noopener noreferrer">
                  Schedule a private viewing
                </a>
                <a className="st-pill" href={`tel:${agent.contact.phone}`}>{agent.contact.phone}</a>
              </div>
            </Fade>
          </Reveal>

          <Reveal>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '2rem', textAlign: 'left', marginTop: '5.5rem', paddingTop: '2.2rem', borderTop: '1px solid var(--st-line-dark)', fontSize: '0.8rem', color: 'var(--st-grey-dark)' }}>
              <div>
                ALL RIGHTS RESERVED.<br />©2026 {agent.name.toUpperCase()}
              </div>
              <div style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {agent.office.name}<br />{agent.office.address}<br />Equal Housing Opportunity · NJ · FL · AZ
              </div>
              <div style={{ display: 'flex', gap: '1.6rem' }}>
                <a href={agent.social.Instagram} target="_blank" rel="noopener noreferrer" style={{ color: '#f4f4f2', textDecoration: 'none' }}>INSTAGRAM</a>
                <a href={agent.social.LinkedIn} target="_blank" rel="noopener noreferrer" style={{ color: '#f4f4f2', textDecoration: 'none' }}>LINKEDIN</a>
                <a href={agent.social.YouTube} target="_blank" rel="noopener noreferrer" style={{ color: '#f4f4f2', textDecoration: 'none' }}>YOUTUBE</a>
              </div>
              <div>
                <a href={`mailto:${agent.contact.email}`} style={{ color: 'var(--st-lime)', textDecoration: 'none' }}>{agent.contact.email}</a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* wordmark gigante cortado por el borde inferior */}
      <div aria-hidden style={{ overflow: 'hidden', lineHeight: 0 }}>
        <span className="st-wordmark" style={{ textAlign: 'center' }}>andrea</span>
      </div>
    </footer>
  );
}
