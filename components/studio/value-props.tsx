import { Reveal, Fade } from './ui';

const PROPS = [
  { t: 'Top 1% in state', d: 'Ranked among the highest-producing agents statewide.' },
  { t: '27+ years of craft', d: 'Sales, marketing and negotiation honed over decades.' },
  { t: 'Ocean City & Jersey Shore', d: 'Beach houses, second homes and shore investments.' },
  { t: 'Berkshire Hathaway', d: 'HomeServices Fox & Roach — Ocean City, NJ office.' },
];

const Icon = ({ i }: { i: number }) => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
    {i === 0 && <path d="M13 3l3 6.5 7 .8-5.2 4.7 1.5 7L13 18.5 6.7 22l1.5-7L3 10.3l7-.8L13 3z" />}
    {i === 1 && <><circle cx="13" cy="13" r="9.5" /><path d="M13 7v6l4 3" /></>}
    {i === 2 && <><path d="M4 20c2.5-8 6-12 9-12s6.5 4 9 12" /><path d="M4 20h18" /></>}
    {i === 3 && <><path d="M4 21V10l9-6 9 6v11" /><path d="M10 21v-6h6v6" /></>}
  </svg>
);

export default function ValueProps() {
  return (
    <section className="st st-light-s st-section" style={{ paddingTop: 'clamp(3rem, 6vh, 5rem)', paddingBottom: 'clamp(3rem, 6vh, 5rem)' }}>
      <Reveal className="st-wrap">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem 3rem' }}>
          {PROPS.map((p, i) => (
            <Fade key={p.t} i={i}>
              <div style={{ color: '#1a1a1a', marginBottom: '0.9rem' }}><Icon i={i} /></div>
              <div style={{ fontFamily: 'var(--grotesk)', fontWeight: 500, letterSpacing: '-0.02em', fontSize: '1.15rem' }}>{p.t}</div>
              <p style={{ margin: '0.4rem 0 0', color: '#777', fontSize: '0.92rem', lineHeight: 1.55 }}>{p.d}</p>
            </Fade>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
