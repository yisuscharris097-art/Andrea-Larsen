import { Reveal } from './ui';
import { agent } from '@/components/agent-data';
import { properties } from '@/lib/properties';

/** ValueProps — strip compacto de credibilidad por NÚMEROS (no adjetivos),
 *  fondo plum para anclar el fold y romper el crema-sobre-crema. Pegado bajo
 *  el buscador. Sin íconos: los números son el protagonista. */
const prices = properties.map((p) => p.price);
const lo = Math.min(...prices), hi = Math.max(...prices);
const fmtM = (n: number) => `${(n / 1e6).toFixed(1).replace('.0', '')}`;

const STATS = [
  { n: '27+', l: 'Years in real estate' },
  { n: 'Top 1%', l: 'Producer, statewide' },
  { n: '3', l: 'States — AZ · FL · NJ' },
  { n: `$${fmtM(lo)}–${fmtM(hi)}M`, l: 'Homes for sale now' },
];

export default function ValueProps() {
  return (
    <section className="vp-strip" aria-label="Why Andrea">
      <Reveal className="st-wrap">
        <span className="vp-eyebrow">● Why Andrea</span>
        <div className="vp-row">
          {STATS.map((s) => (
            <div className="vp-stat" key={s.l}>
              <div className="vp-n">{s.n}</div>
              <div className="vp-l">{s.l}</div>
            </div>
          ))}
        </div>
        {/* línea de credenciales — aquí va el logo real del brokerage cuando lo tengamos */}
        <div className="vp-creds">
          {agent.brokerage} · REALTOR® · Licensed NJ · FL · AZ
        </div>
      </Reveal>
    </section>
  );
}
