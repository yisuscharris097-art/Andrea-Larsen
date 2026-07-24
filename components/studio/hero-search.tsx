'use client';

/** HeroSearch — buscador de lujo: pestañas Buy/Sell, campo de ubicación
 *  protagonista con AUTOCOMPLETADO AGRUPADO (áreas + direcciones; edificios y
 *  MLS# llegan con IDX), precio/tipo secundarios con chevron, botón que cuenta
 *  resultados EN VIVO (no inventario), chips de búsqueda rápida, atajo "/" y
 *  versión mini sticky al hacer scroll. */
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { properties } from '@/lib/properties';
import { neighborhoods, listingsIn } from '@/lib/neighborhoods';

/** Dropdown custom (blanco, chevron clickeable) — reemplaza al <select> nativo
 *  cuyo despliegue tomaba el estilo del sistema y cuya flecha no abría nada. */
function Dropdown({ label, value, options, onChange }: {
  label: string;
  value: string;
  options: { label: string; v: string }[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.v === value) || options[0];

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  return (
    <div className="hs-sel" ref={ref}>
      <span className="hs-lab">{label}</span>
      <button type="button" className={`hs-selrow${open ? ' open' : ''}`} onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox" aria-expanded={open} aria-label={`${label}: ${current.label}`}>
        <span className="hs-selval">{current.label}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden className="hs-chev">
          <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="hs-menu" role="listbox" aria-label={label}>
          {options.map((o) => (
            <button key={o.v} type="button" role="option" aria-selected={o.v === value}
              className={`hs-mopt${o.v === value ? ' on' : ''}`}
              onClick={() => { onChange(o.v); setOpen(false); }}>
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const PRICE_MAX = [
  { label: 'Any price', v: 0 },
  { label: 'Up to $2M', v: 2000000 },
  { label: 'Up to $3M', v: 3000000 },
  { label: 'Up to $4M', v: 4000000 },
  { label: 'Up to $6M', v: 6000000 },
];
const TYPES = Array.from(new Set(properties.map((p) => p.type)));
const PRICE_OPTS = PRICE_MAX.map((p) => ({ label: p.label, v: String(p.v) }));
const TYPE_OPTS = [{ label: 'Any type', v: '' }, ...TYPES.map((t) => ({ label: t, v: t }))];
const CHIPS: { label: string; p: Record<string, string> }[] = [
  { label: 'Under $2M', p: { maxPrice: '2000000' } },
  { label: 'Ocean City', p: { city: 'Ocean City' } },
  { label: 'Houses', p: { type: 'House' } },
  { label: '2,500+ sq ft', p: { minSqft: '2500' } },
];

type Sug =
  | { kind: 'area'; label: string; sub: string; count: number; city: string }
  | { kind: 'addr'; label: string; sub: string; slug: string };

export default function HeroSearch() {
  const router = useRouter();
  const [tab, setTab] = useState<'buy' | 'sell'>('buy');
  const [q, setQ] = useState('');
  const [city, setCity] = useState('');
  const [maxPrice, setMaxPrice] = useState(0);
  const [type, setType] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [sellAddr, setSellAddr] = useState('');
  const [stuck, setStuck] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // conteo EN VIVO (no exhibe el inventario total)
  const count = useMemo(
    () => properties.filter((p) => (!city || p.city === city) && (!maxPrice || p.price <= maxPrice) && (!type || p.type === type)).length,
    [city, maxPrice, type],
  );
  const hasFilter = !!(city || maxPrice || type);

  // autocompletado agrupado
  const sugg = useMemo<Sug[]>(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    const areas: Sug[] = neighborhoods
      .filter((n) => n.name.toLowerCase().includes(term))
      .map((n) => ({ kind: 'area', label: n.name, sub: n.tagline, count: listingsIn(n.name).length, city: n.name }));
    const addrs: Sug[] = properties
      .filter((p) => p.address.toLowerCase().includes(term) || p.city.toLowerCase().includes(term))
      .slice(0, 5)
      .map((p) => ({ kind: 'addr', label: p.address, sub: `${p.city}, ${p.state} · ${p.priceDisplay}`, slug: p.slug }));
    return [...areas, ...addrs];
  }, [q]);

  const pick = (s: Sug) => {
    if (s.kind === 'addr') { router.push(`/listing/${s.slug}`); return; }
    setCity(s.city); setQ(''); setOpen(false); setActive(-1);
  };

  const go = () => {
    const p = new URLSearchParams();
    if (city) p.set('city', city);
    if (maxPrice) p.set('maxPrice', String(maxPrice));
    if (type) p.set('type', type);
    const qs = p.toString();
    router.push(`/properties${qs ? `?${qs}` : ''}`);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (!open || sugg.length === 0) { if (e.key === 'Enter') go(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => (a + 1) % sugg.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => (a - 1 + sugg.length) % sugg.length); }
    else if (e.key === 'Enter') { e.preventDefault(); active >= 0 ? pick(sugg[active]) : go(); }
    else if (e.key === 'Escape') { setOpen(false); setActive(-1); }
  };

  // atajo "/" para enfocar
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const el = document.activeElement;
      const typing = el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT');
      if (e.key === '/' && !typing) { e.preventDefault(); inputRef.current?.focus(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  // sticky mini al salir el buscador de pantalla (scroll passive + rAF)
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const el = sentinelRef.current;
      if (el) setStuck(el.getBoundingClientRect().bottom < -40);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check); };
    window.addEventListener('scroll', onScroll, { passive: true });
    check();
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  const locValue = city || q;

  return (
    <>
      <div ref={sentinelRef} aria-hidden />
      <section aria-label="Search" className="hs-band">
        <div className="hs-card">
          <div className="hs-tabs" role="tablist" aria-label="Search mode">
            <button role="tab" aria-selected={tab === 'buy'} className={tab === 'buy' ? 'on' : ''} onClick={() => setTab('buy')}>Buy</button>
            <button role="tab" aria-selected={tab === 'sell'} className={tab === 'sell' ? 'on' : ''} onClick={() => setTab('sell')}>Sell</button>
          </div>

          {tab === 'buy' ? (
            <>
              <div className="hs-form">
                <div className="hs-loc">
                  <span className="hs-lab">Location</span>
                  <input
                    ref={inputRef}
                    value={locValue}
                    readOnly
                    onMouseDown={(e) => { e.preventDefault(); window.dispatchEvent(new Event('open-search')); }}
                    onFocus={() => window.dispatchEvent(new Event('open-search'))}
                    placeholder="Try “waterfront under $3M” — or ⌘K"
                    aria-label="Search in natural language" role="button"
                    style={{ cursor: 'pointer' }}
                  />
                  {open && sugg.length > 0 && (
                    <div className="hs-suggest" id="hs-suggest" role="listbox">
                      {(['area', 'addr'] as const).map((grp) => {
                        const items = sugg.filter((s) => s.kind === grp);
                        if (!items.length) return null;
                        return (
                          <div key={grp}>
                            <div className="hs-grp">{grp === 'area' ? 'Areas' : 'Addresses'} <span>{items.length}</span></div>
                            {items.map((s) => {
                              const idx = sugg.indexOf(s);
                              return (
                                <button key={s.label + idx} role="option" aria-selected={active === idx}
                                  className={`hs-opt${active === idx ? ' on' : ''}`}
                                  onMouseEnter={() => setActive(idx)} onMouseDown={(e) => { e.preventDefault(); pick(s); }}>
                                  <span className="o-l">{s.label}</span>
                                  <span className="o-s">{s.sub}</span>
                                  {s.kind === 'area' && <span className="o-c">{s.count} home{s.count === 1 ? '' : 's'}</span>}
                                </button>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <Dropdown label="Price" value={String(maxPrice)} options={PRICE_OPTS} onChange={(v) => setMaxPrice(Number(v))} />
                <Dropdown label="Type" value={type} options={TYPE_OPTS} onChange={setType} />
                <button className="hs-go" onClick={go}>
                  {hasFilter ? `See ${count} home${count === 1 ? '' : 's'}` : 'Search homes'} →
                </button>
              </div>
              <div className="hs-chips">
                {CHIPS.map((c) => (
                  <button key={c.label} onClick={() => router.push(`/properties?${new URLSearchParams(c.p).toString()}`)}>
                    {c.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="hs-form hs-sellform">
              <div className="hs-loc">
                <span className="hs-lab">Your home address</span>
                <input value={sellAddr} onChange={(e) => setSellAddr(e.target.value)} placeholder="123 Ocean Ave, Ocean City, NJ" aria-label="Your home address"
                  onKeyDown={(e) => { if (e.key === 'Enter') router.push(`/sell${sellAddr.trim() ? `?address=${encodeURIComponent(sellAddr.trim())}` : ''}#valuation`); }} />
              </div>
              <button className="hs-go" onClick={() => router.push(`/sell${sellAddr.trim() ? `?address=${encodeURIComponent(sellAddr.trim())}` : ''}#valuation`)}>
                Get my valuation →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* mini sticky */}
      <div className={`hs-mini${stuck ? ' show' : ''}`} aria-hidden={!stuck}>
        <button className="hs-mini-loc" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M7 1a5 5 0 015 5c0 3.5-5 9-5 9S2 9.5 2 6a5 5 0 015-5z" stroke="currentColor" strokeWidth="1.3"/><circle cx="7" cy="6" r="1.6" stroke="currentColor" strokeWidth="1.3"/></svg>
          {city || 'Search the Jersey Shore'}
        </button>
        <button className="hs-mini-go" onClick={go}>{hasFilter ? `See ${count}` : 'Search'} →</button>
      </div>
    </>
  );
}
