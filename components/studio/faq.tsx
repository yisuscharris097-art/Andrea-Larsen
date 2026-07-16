'use client';

import { useState } from 'react';
import { Reveal, Line } from './ui';

const FAQS = [
  {
    q: 'How do I schedule a private viewing?',
    a: 'Book directly through the calendar link or call 561-888-3494. Andrea personally walks every showing — no hand-offs to junior agents.',
  },
  {
    q: 'What does “Coming Soon” mean for a listing?',
    a: 'The property is being prepared for market and can be previewed privately before it lists publicly — often the best window to move.',
  },
  {
    q: 'Which areas does Andrea cover?',
    a: 'She is licensed in Arizona, Florida and New Jersey, with active listings across Bucks County (PA) and Maryland through Berkshire Hathaway HomeServices Fox & Roach.',
  },
  {
    q: 'Does she work with buyers, sellers or both?',
    a: 'Both. Andrea is a Luxury Property Specialist acting as listing agent and dedicated buyer’s agent, from investment purchases to forever homes.',
  },
];

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="st st-light-s st-section">
      <div className="st-wrap" style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 1fr) minmax(0, 1.7fr)', gap: '3rem' }} id="faq">
        <Reveal>
          <span className="st-eyebrow">FAQ</span>
          <h2 className="st-h2" style={{ margin: '1rem 0 0' }}>
            <Line i={0}>Good</Line>
            <Line i={1}><span className="st-it">questions.</span></Line>
          </h2>
        </Reveal>
        <Reveal>
          <div className="st-faq">
            {FAQS.map((f, i) => (
              <div key={i} className={`st-faq-i${open === i ? ' open' : ''}`}>
                <button className="st-faq-q" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                  <h3>{f.q}</h3>
                  <span className="x" aria-hidden>+</span>
                </button>
                <div className="st-faq-a"><div><p>{f.a}</p></div></div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
      <style>{`@media (max-width: 860px){ #faq{ grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}
