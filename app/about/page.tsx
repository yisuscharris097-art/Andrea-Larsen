import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { agent } from '@/components/agent-data';
import { Reveal, Line, Fade, CountUp } from '@/components/studio/ui';
import CursorFX from '@/components/studio/cursor-fx';
import Curtain from '@/components/studio/curtain';
import '../studio.css';

export const metadata: Metadata = {
  title: 'About Andrea Larsen — Luxury REALTOR®, Ocean City NJ | Love Living Coast2Coast',
  description:
    'Andrea Larsen — REALTOR®, Luxury Property Specialist with Berkshire Hathaway HomeServices Fox & Roach. 27+ years, Top 1% in state, licensed in NJ, FL and AZ.',
};

const PHILOSOPHY = [
  { t: 'Quality', d: 'Every listing prepared with meticulous attention to detail — photography, staging, presentation. A home deserves to be shown the way it deserves to be lived in.' },
  { t: 'Trust', d: 'Clear, honest communication at every step. You always know where your sale stands, what the market is saying, and what Andrea would do in your position.' },
  { t: 'Legacy', d: 'Andrea comes from a family of top-producing agents and investors. Real estate is not her job — it is the family craft, refined over generations.' },
];

export default function AboutPage() {
  return (
    <main className="st st-light-s" style={{ minHeight: '100vh' }}>
      <CursorFX />
      <Curtain />

      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem clamp(1.25rem, 5vw, 6.5rem)' }}>
        <Link href="/" className="st-pill st-pill--dark" data-curtain="Home">← Home</Link>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link href="/properties" className="st-pill st-pill--dark" data-curtain="Properties">Properties</Link>
          <Link href="/contact" className="st-pill st-pill--solid" data-curtain="Contact">Let&apos;s talk</Link>
        </div>
      </nav>

      {/* hero */}
      <header className="st-section abt-hero" style={{ paddingTop: '2.5rem', display: 'grid', gridTemplateColumns: 'minmax(280px, 480px) minmax(0, 1fr)', gap: '4rem', alignItems: 'center' }}>
        <Reveal>
          <div className="st-imgreveal" style={{ position: 'relative', borderRadius: 26, overflow: 'hidden', aspectRatio: '4/5', background: '#e2e2de' }}>
            <Image src={agent.photo} alt={`${agent.name} — REALTOR®, Luxury Property Specialist`} fill priority style={{ objectFit: 'cover' }} sizes="(max-width: 900px) 92vw, 480px" />
          </div>
        </Reveal>
        <Reveal>
          <span className="st-eyebrow">About Andrea</span>
          <h1 className="st-h1" style={{ margin: '1.2rem 0 1.6rem' }}>
            <Line i={0}>The one who</Line>
            <Line i={1}>hands you</Line>
            <Line i={2}><span className="st-it">the keys.</span></Line>
          </h1>
          <Fade i={3}>
            <p className="st-body" style={{ maxWidth: '54ch' }}>{agent.bio}</p>
          </Fade>
          <Fade i={4}>
            <p className="st-body" style={{ maxWidth: '54ch', marginTop: '1rem' }}>
              Today her market is {agent.market} — beach houses, second homes and shore investments,
              backed by {agent.office.name} from the {agent.office.address.split(',')[1]} office.
            </p>
          </Fade>
        </Reveal>
      </header>

      {/* stats */}
      <section className="st-section" style={{ paddingTop: 0 }}>
        <Reveal>
          <div className="st-stats">
            <Fade i={0} className="st-stat" style={{ ['--i' as any]: 0 }}>
              <div className="v"><CountUp to={27} suffix="+" /></div>
              <div className="l">Years in real estate</div>
            </Fade>
            <Fade i={1} className="st-stat" style={{ ['--i' as any]: 1 }}>
              <div className="v">Top 1%</div>
              <div className="l">Producer, statewide</div>
            </Fade>
            <Fade i={2} className="st-stat" style={{ ['--i' as any]: 2 }}>
              <div className="v"><CountUp to={3} /></div>
              <div className="l">States licensed — NJ · FL · AZ</div>
            </Fade>
            <Fade i={3} className="st-stat" style={{ ['--i' as any]: 3 }}>
              <div className="v"><CountUp to={20} suffix="+" /></div>
              <div className="l">Active shore residences</div>
            </Fade>
          </div>
        </Reveal>
      </section>

      {/* filosofía */}
      <section className="st-mist-s st-section">
        <div className="st-wrap">
          <Reveal>
            <span className="st-eyebrow" style={{ color: '#4a5457' }}>The Larsen manifesto, explained</span>
            <h2 className="st-h2" style={{ margin: '1rem 0 3rem' }}>
              <Line i={0}>Quality <span className="st-dash">–</span>Trust</Line>
              <Line i={1}><span className="st-it">Legacy.</span></Line>
            </h2>
          </Reveal>
          <Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.6rem' }}>
              {PHILOSOPHY.map((f, i) => (
                <Fade key={f.t} i={i}>
                  <div style={{ background: '#FCFCFA', borderRadius: 20, padding: '2rem 1.8rem', height: '100%', border: '1px solid rgba(35,41,44,0.12)' }}>
                    <h3 style={{ fontFamily: 'var(--grotesk)', fontWeight: 500, fontStretch: '115%', fontSize: '1.6rem', letterSpacing: '-0.02em', color: '#4E2A4F', margin: '0 0 0.8rem' }}>{f.t}</h3>
                    <p style={{ color: '#555', lineHeight: 1.6, margin: 0, fontSize: '0.95rem' }}>{f.d}</p>
                  </div>
                </Fade>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* credenciales + CTA */}
      <section className="st-section" style={{ textAlign: 'center' }}>
        <Reveal>
          <span className="st-eyebrow" style={{ justifyContent: 'center' }}>Credentials</span>
          <Fade i={1}>
            <p className="st-body" style={{ margin: '1.4rem auto 0', maxWidth: '58ch' }}>
              {agent.titles.join(' · ')} — {agent.office.name}. {agent.compliance}
            </p>
          </Fade>
          <Fade i={2}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', marginTop: '2.4rem', flexWrap: 'wrap' }}>
              <Link href="/contact" className="st-pill st-pill--solid" data-curtain="Contact">Let&apos;s talk →</Link>
              <Link href="/properties" className="st-pill st-pill--dark" data-curtain="Properties">See the collection</Link>
            </div>
          </Fade>
        </Reveal>
      </section>

      <style>{`@media (max-width: 900px){ .abt-hero{ grid-template-columns: 1fr !important; } }`}</style>
    </main>
  );
}
