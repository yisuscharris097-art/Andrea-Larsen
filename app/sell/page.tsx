import type { Metadata } from 'next';
import Link from 'next/link';
import { agent } from '@/components/agent-data';
import { Reveal, Line, Fade, CountUp } from '@/components/studio/ui';
import ValuationForm from '@/components/studio/valuation-form';
import CursorFX from '@/components/studio/cursor-fx';
import Curtain from '@/components/studio/curtain';
import '../studio.css';

export const metadata: Metadata = {
  title: 'Sell your Jersey Shore home with Andrea Larsen | Free Home Valuation',
  description:
    'Sell with a Top 1% agent: 27+ years, Berkshire Hathaway HomeServices Fox & Roach. Get your free Ocean City / Jersey Shore home valuation.',
};

const PROCESS = [
  { t: 'Free home valuation', d: 'A real number from real comparables — not an algorithm’s guess.' },
  { t: 'Market analysis', d: 'What’s moving on your street, at what price, and how fast.' },
  { t: 'Pricing strategy', d: 'The number that creates competition instead of waiting.' },
  { t: 'Marketing & staging', d: 'Photography, staging guidance and a launch plan before day one.' },
  { t: 'Showings & offers', d: 'Qualified buyers, organized showings, every offer explained.' },
  { t: 'Negotiation', d: '27 years of closing at the right number — on your side of the table.' },
  { t: 'Closing', d: 'Inspections, timelines and paperwork, handled to the keys.' },
];

const MARKETING = [
  'Professional photography', 'Drone & video walkthroughs', 'Staging consultation',
  'Open houses', 'Social media campaign', 'Berkshire Hathaway broker network',
  'Syndication: Zillow · Redfin · Realtor.com',
];

export default function SellPage() {
  return (
    <main className="st st-light-s" style={{ minHeight: '100vh' }}>
      <CursorFX />
      <Curtain />

      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem clamp(1.25rem, 5vw, 6.5rem)' }}>
        <Link href="/" className="st-pill st-pill--dark" data-curtain="Home">← Home</Link>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link href="/about" className="st-pill st-pill--dark" data-curtain="About">About</Link>
          <a href="#valuation" className="st-pill st-pill--solid">Free valuation</a>
        </div>
      </nav>

      {/* hero */}
      <header className="st-section" style={{ paddingTop: '2.5rem', paddingBottom: '3rem' }}>
        <Reveal>
          <span className="st-eyebrow">Sell with Andrea</span>
          <h1 className="st-h1" style={{ margin: '1.2rem 0 1.4rem' }}>
            <Line i={0}>The highest price</Line>
            <Line i={1}>your home can <span className="st-it">say.</span></Line>
          </h1>
          <Fade i={2}>
            <p className="st-body">
              Half of great selling is preparation, the other half is negotiation. Andrea has spent
              27 years mastering both — with the reach of Berkshire Hathaway behind every listing.
            </p>
          </Fade>
        </Reveal>
      </header>

      {/* why Andrea — stats */}
      <section className="st-section" style={{ paddingTop: 0 }}>
        <Reveal>
          <div className="st-stats">
            <Fade i={0} className="st-stat" style={{ ['--i' as any]: 0 }}>
              <div className="v"><CountUp to={27} suffix="+" /></div>
              <div className="l">Years selling homes</div>
            </Fade>
            <Fade i={1} className="st-stat" style={{ ['--i' as any]: 1 }}>
              <div className="v">Top 1%</div>
              <div className="l">Producer, statewide</div>
            </Fade>
            <Fade i={2} className="st-stat" style={{ ['--i' as any]: 2 }}>
              <div className="v"><CountUp to={20} suffix="+" /></div>
              <div className="l">Active shore listings today</div>
            </Fade>
            <Fade i={3} className="st-stat" style={{ ['--i' as any]: 3 }}>
              <div className="v">BHHS</div>
              <div className="l">Fox &amp; Roach, REALTORS®</div>
            </Fade>
          </div>
        </Reveal>
      </section>

      {/* proceso */}
      <section className="st-mist-s st-section">
        <div className="st-wrap">
          <Reveal>
            <span className="st-eyebrow" style={{ color: '#4a5457' }}>The selling process</span>
            <h2 className="st-h2" style={{ margin: '1rem 0 2.6rem' }}>
              <Line i={0}>Seven steps to</Line>
              <Line i={1}><span className="st-it">sold.</span></Line>
            </h2>
          </Reveal>
          <Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.2rem' }}>
              {PROCESS.map((s, i) => (
                <Fade key={s.t} i={i % 4}>
                  <div style={{ background: '#FCFCFA', borderRadius: 18, padding: '1.6rem 1.5rem', height: '100%', border: '1px solid rgba(35,41,44,0.12)', position: 'relative', overflow: 'hidden' }}>
                    <span aria-hidden style={{ position: 'absolute', right: 6, bottom: -26, fontFamily: 'var(--grotesk)', fontWeight: 500, fontSize: '6.5rem', lineHeight: 1, color: 'rgba(35,41,44,0.06)' }}>{String(i + 1).padStart(2, '0')}</span>
                    <h3 style={{ fontFamily: 'var(--grotesk)', fontWeight: 500, fontStretch: '115%', fontSize: '1.2rem', letterSpacing: '-0.01em', color: '#4E2A4F', margin: '0 0 0.5rem' }}>{i + 1}. {s.t}</h3>
                    <p style={{ color: '#555', lineHeight: 1.55, margin: 0, fontSize: '0.9rem' }}>{s.d}</p>
                  </div>
                </Fade>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* marketing plan */}
      <section className="st-section">
        <div className="st-wrap">
          <Reveal>
            <span className="st-eyebrow">The marketing plan</span>
            <h2 className="st-h2" style={{ margin: '1rem 0 2rem' }}>
              <Line i={0}>Launched like a</Line>
              <Line i={1}><span className="st-it">flagship.</span></Line>
            </h2>
            <Fade i={2}>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', maxWidth: 760 }}>
                {MARKETING.map((m) => (
                  <span key={m} style={{ border: '1px solid var(--st-line)', borderRadius: 999, padding: '0.55em 1.2em', fontSize: '0.85rem', background: '#fff' }}>
                    <span style={{ color: '#8C6D2F' }}>✓</span> {m}
                  </span>
                ))}
              </div>
            </Fade>
          </Reveal>
        </div>
      </section>

      {/* lead magnet */}
      <ValuationForm />

      <section className="st-section" style={{ textAlign: 'center', paddingTop: '2rem' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--st-grey)' }}>
          {agent.office.name} · {agent.office.address} · {agent.compliance}
        </p>
      </section>
    </main>
  );
}
