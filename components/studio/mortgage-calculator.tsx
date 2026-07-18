'use client';

/**
 * MortgageCalculator — estimador de pago mensual en cada PDP.
 * Monthly = PI + Taxes + Insurance + HOA
 *   PI = P·[r(1+r)^n] / [(1+r)^n − 1]
 * Sliders + números editables, resultado en tiempo real. Defaults honestos:
 * 20% down · 6.5% (30-yr fixed aprox — actualizar mensualmente) · taxes 1.1%
 * (rango shore NJ) · insurance 0.4%. Solo estimación, no oferta de crédito.
 */

import { useMemo, useState } from 'react';

const fmt = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 0 });

function Row({ label, value, suffix, min, max, step, onChange }: {
  label: string; value: number; suffix: string; min: number; max: number; step: number; onChange: (v: number) => void;
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--st-grey)' }}>{label}</span>
        <span style={{ fontFamily: 'var(--grotesk)', fontWeight: 500, fontVariantNumeric: 'tabular-nums', fontSize: '0.95rem' }}>
          {value}{suffix}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(+e.target.value)}
        aria-label={label}
        style={{ width: '100%', accentColor: '#4E2A4F' }}
      />
    </div>
  );
}

export default function MortgageCalculator({ price, isCondo }: { price: number; isCondo?: boolean }) {
  const [down, setDown] = useState(20);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(30);
  const [taxPct, setTaxPct] = useState(1.1);
  const [insPct, setInsPct] = useState(0.4);
  const [hoa, setHoa] = useState(isCondo ? 350 : 0);

  const calc = useMemo(() => {
    const principal = price * (1 - down / 100);
    const r = rate / 100 / 12;
    const n = years * 12;
    const pi = r > 0 ? principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : principal / n;
    const taxes = (price * taxPct) / 100 / 12;
    const ins = (price * insPct) / 100 / 12;
    return { pi, taxes, ins, total: pi + taxes + ins + hoa, downAmt: price * (down / 100) };
  }, [price, down, rate, years, taxPct, insPct, hoa]);

  return (
    <section aria-label="Mortgage calculator" style={{ border: '1px solid var(--st-line)', borderRadius: 20, background: '#fff', padding: 'clamp(1.4rem, 3vw, 2rem)', marginTop: '3.4rem' }}>
      <span className="st-eyebrow">Estimate your monthly payment</span>

      <div className="mc-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(220px, 300px)', gap: '2.2rem', marginTop: '1.4rem', alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: '1.3rem' }}>
          <Row label={`Down payment — $${fmt(calc.downAmt)}`} value={down} suffix="%" min={5} max={60} step={1} onChange={setDown} />
          <Row label="Interest rate (30-yr fixed)" value={rate} suffix="%" min={3} max={10} step={0.125} onChange={setRate} />
          <Row label="Loan term" value={years} suffix=" yrs" min={10} max={30} step={5} onChange={setYears} />
          <Row label="Property taxes (annual)" value={taxPct} suffix="%" min={0.5} max={3} step={0.05} onChange={setTaxPct} />
          <Row label="Home insurance (annual)" value={insPct} suffix="%" min={0.1} max={1.5} step={0.05} onChange={setInsPct} />
          <Row label="HOA (monthly)" value={hoa} suffix=" $" min={0} max={1500} step={25} onChange={setHoa} />
        </div>

        <div style={{ background: '#F4F4F2', borderRadius: 16, padding: '1.4rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--st-grey)' }}>Estimated monthly</div>
          <div style={{ fontFamily: 'var(--grotesk)', fontWeight: 500, fontVariantNumeric: 'tabular-nums', fontSize: 'clamp(2rem, 3.4vw, 2.8rem)', letterSpacing: '-0.02em', color: '#4E2A4F', margin: '0.3rem 0 1rem' }}>
            ${fmt(calc.total)}
          </div>
          <div style={{ display: 'grid', gap: 6, fontSize: '0.82rem', color: '#555', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Principal &amp; interest</span><b style={{ fontVariantNumeric: 'tabular-nums' }}>${fmt(calc.pi)}</b></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Taxes</span><b style={{ fontVariantNumeric: 'tabular-nums' }}>${fmt(calc.taxes)}</b></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Insurance</span><b style={{ fontVariantNumeric: 'tabular-nums' }}>${fmt(calc.ins)}</b></div>
            {hoa > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>HOA</span><b style={{ fontVariantNumeric: 'tabular-nums' }}>${fmt(hoa)}</b></div>}
          </div>
          <p style={{ fontSize: '0.68rem', color: 'var(--st-grey)', marginTop: '1rem', lineHeight: 1.45 }}>
            Estimate only — not a loan offer. Rates and taxes vary; confirm with your lender.
          </p>
        </div>
      </div>
      <style>{`@media (max-width: 760px){ .mc-grid{ grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}
