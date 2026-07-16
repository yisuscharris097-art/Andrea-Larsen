import Image from 'next/image';
import { agent } from '@/components/agent-data';
import { Reveal, Line, Fade } from './ui';

export default function AgentEditorial() {
  return (
    <section className="st st-light-s st-section" id="agent">
      <div className="st-wrap st-agent-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 460px) minmax(0, 1fr)', gap: '4rem', alignItems: 'center' }}>
        <Reveal>
          <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', aspectRatio: '4/5', background: '#e2e2de' }}>
            <Image src={agent.photo} alt={`${agent.name} — ${agent.titles[0]}`} fill style={{ objectFit: 'cover', filter: 'saturate(0.82)' }} sizes="(max-width: 900px) 90vw, 460px" />
            <div style={{ position: 'absolute', left: 14, bottom: 14, background: 'rgba(13,13,13,0.55)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', borderRadius: 14, padding: '0.7em 1.1em', fontSize: '0.78rem' }}>
              Trusted coast to coast · {agent.experience}
            </div>
          </div>
        </Reveal>

        <Reveal>
          <span className="st-eyebrow">The agent</span>
          <h2 className="st-h2" style={{ margin: '1rem 0 1.6rem' }}>
            <Line i={0}>The one who</Line>
            <Line i={1}>hands you <span className="st-it">the keys.</span></Line>
          </h2>
          <Fade i={2}>
            <p className="st-body">{agent.bio}</p>
          </Fade>
          <Fade i={3}>
            <dl className="st-sheet" style={{ marginTop: '2.4rem' }}>
              <div><dt>Name</dt><dd>{agent.name}</dd></div>
              <div><dt>Brokerage</dt><dd style={{ fontSize: '1.1rem' }}>{agent.brokerage}</dd></div>
              <div><dt>Rank</dt><dd>{agent.rank}</dd></div>
              <div><dt>Licensed</dt><dd>AZ · FL · NJ</dd></div>
            </dl>
          </Fade>
          <Fade i={4}>
            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '2.2rem', flexWrap: 'wrap' }}>
              <a className="st-pill st-pill--solid" href={agent.contact.calendly} target="_blank" rel="noopener noreferrer">Schedule a private viewing</a>
              <a className="st-pill st-pill--dark" href={`tel:${agent.contact.phone}`}>{agent.contact.phone}</a>
            </div>
          </Fade>
        </Reveal>
      </div>
      <style>{`@media (max-width: 900px){ .st-agent-grid{ grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}
