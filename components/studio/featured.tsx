import Image from 'next/image';
import { listings } from '@/components/listings-data';
import { Reveal, Line, Fade } from './ui';

const Bed = () => (
  <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden><path d="M2 15V6m0 5h16v4M2 11V9h9v2m5-3h-3v3" /></svg>
);
const Bath = () => (
  <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden><path d="M3 10h14v2a4 4 0 01-4 4H7a4 4 0 01-4-4v-2zM5 10V4.5A1.5 1.5 0 016.5 3h1" /></svg>
);

export default function Featured() {
  const six = listings.slice(0, 6);
  return (
    <section className="st st-light-s st-section" id="featured">
      <div className="st-wrap">
        <Reveal>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '3.4rem' }}>
            <div>
              <span className="st-eyebrow">Featured listings</span>
              <h2 className="st-h2" style={{ margin: '1rem 0 0' }}>
                <Line i={0}>Explore our</Line>
                <Line i={1}><span className="st-it">premier</span> residences</Line>
              </h2>
            </div>
            <Fade i={2}>
              <a className="st-pill st-pill--solid" href="#collection">See all properties →</a>
            </Fade>
          </div>
        </Reveal>

        <Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2.4rem 1.8rem' }}>
            {six.map((l, i) => {
              const [addr, city] = l.title.split(/,(.+)/);
              const specs = (l.specs || '').split('·').map((s) => s.trim());
              return (
                <Fade key={l.title} i={i % 3}>
                  <a className="st-card-l" href={l.link} target="_blank" rel="noopener noreferrer">
                    <div className="ph">
                      <Image src={l.thumbnail} alt={l.title} width={800} height={600} />
                      <span className="badge">{l.banner || 'Coming Soon'}</span>
                      <span className="arrow" aria-hidden>→</span>
                    </div>
                    <div className="meta">
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4em' }}><Bed /> {specs[0] || ''}</span>
                      <span aria-hidden>·</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4em' }}><Bath /> {specs[1] || ''}</span>
                    </div>
                    <div className="name">{addr}</div>
                    <div className="price-row">
                      <span className="price">{l.price}</span>
                      <span className="addr">{(city || '').trim()}</span>
                    </div>
                  </a>
                </Fade>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
