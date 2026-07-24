'use client';

/** SearchCommand — takeover de búsqueda en lenguaje natural (⌘K).
 *  Escribes una frase → chips editables con la interpretación → resultados con
 *  foto en vivo. Nunca cero (relaja el filtro menos importante). Navegación por
 *  teclado completa. Motor determinista (lib/search-parse); /api/search es mejora
 *  opcional. Se abre con ⌘K o con el evento 'open-search'. */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { properties } from '@/lib/properties';
import { parseQuery, applyFilters, why, CITIES, type Filters, type Chip } from '@/lib/search-parse';

const EXAMPLES = [
  'waterfront under $3M',
  '5-bedroom house in Ocean City',
  'something to rent out in summer',
  'condo near the beach',
  'new construction under $2M',
];
const TOP_AREAS = [...CITIES]
  .map((c) => ({ city: c, n: properties.filter((p) => p.city === c).length }))
  .sort((a, b) => b.n - a.n)
  .slice(0, 3);
const NEW_LISTINGS = properties.slice(0, 3);

function filtersToQS(f: Filters): string {
  const p = new URLSearchParams();
  if (f.city) p.set('city', f.city);
  if (f.maxPrice) p.set('maxPrice', String(f.maxPrice));
  if (f.type) p.set('type', f.type);
  if (f.minSqft) p.set('minSqft', String(f.minSqft));
  return p.toString();
}

export default function SearchCommand() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [suppressed, setSuppressed] = useState<Set<string>>(new Set());
  const [ph, setPh] = useState(0);
  const [active, setActive] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // abrir con ⌘K / Ctrl+K y con el evento 'open-search'
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen((o) => !o); }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('open-search', onOpen);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('open-search', onOpen); };
  }, []);

  // lock scroll + focus + Lenis pause al abrir
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const lenis = (window as unknown as { __descentLenis?: { stop: () => void; start: () => void } }).__descentLenis;
    lenis?.stop();
    try { setRecent(JSON.parse(localStorage.getItem('al-recent') || '[]')); } catch { /* noop */ }
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => { document.body.style.overflow = prev; lenis?.start(); clearTimeout(t); };
  }, [open]);

  // placeholder rotativo
  useEffect(() => {
    if (!open || q) return;
    const id = setInterval(() => setPh((i) => (i + 1) % EXAMPLES.length), 2600);
    return () => clearInterval(id);
  }, [open, q]);

  // parseo + filtros (determinista, instantáneo). Los chips suprimidos se quitan.
  const { filters, chips } = useMemo(() => {
    const { filters, chips } = parseQuery(q);
    const activeChips = chips.filter((c) => !suppressed.has(c.key));
    const f: Filters = { ...filters, concepts: [...filters.concepts] };
    for (const c of chips) {
      if (!suppressed.has(c.key)) continue;
      if (c.key.startsWith('concept:')) f.concepts = f.concepts.filter((l) => 'concept:' + l !== c.key);
      else (f as Record<string, unknown>)[c.key] = undefined;
    }
    return { filters: f, chips: activeChips };
  }, [q, suppressed]);

  const hasQuery = q.trim().length > 0;
  const { results, relaxedNote } = useMemo(() => (hasQuery ? applyFilters(filters) : { results: [], relaxedNote: undefined }), [filters, hasQuery]);

  useEffect(() => { setActive(0); }, [q]);

  const removeChip = (key: string) => setSuppressed((s) => new Set(s).add(key));

  const close = useCallback(() => { setOpen(false); setQ(''); setSuppressed(new Set()); setActive(0); }, []);

  const goListing = useCallback((slug: string) => {
    if (q.trim()) { try { const r = [q.trim(), ...JSON.parse(localStorage.getItem('al-recent') || '[]')].filter((v, i, a) => a.indexOf(v) === i).slice(0, 5); localStorage.setItem('al-recent', JSON.stringify(r)); } catch { /* noop */ } }
    close(); router.push(`/listing/${slug}`);
  }, [q, close, router]);

  const seeAll = useCallback(() => { const qs = filtersToQS(filters); close(); router.push(`/properties${qs ? `?${qs}` : ''}`); }, [filters, close, router]);

  // teclado dentro del panel
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (!hasQuery || results.length === 0) { if (e.key === 'Enter') seeAll(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(results.length, a + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (active < results.length) goListing(results[active].slug); else seeAll(); }
  };

  if (!open) return null;

  return (
    <div className="sc-overlay" role="dialog" aria-modal="true" aria-label="Search" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="sc-panel" onKeyDown={onKeyDown}>
        {/* input */}
        <div className="sc-inputrow">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className="sc-mag"><circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.5"/><path d="M14 14l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <input
            ref={inputRef} value={q} onChange={(e) => { setQ(e.target.value); setSuppressed(new Set()); }}
            placeholder={`Try “${EXAMPLES[ph]}”`}
            aria-label="Describe what you're looking for" autoComplete="off" spellCheck={false}
          />
          <button className="sc-esc" onClick={close} aria-label="Close">esc</button>
        </div>

        {/* chips de interpretación (editables) */}
        {hasQuery && chips.length > 0 && (
          <div className="sc-chips" aria-label="Interpreted filters">
            <span className="sc-chips-lab">Searching</span>
            {chips.map((c: Chip) => (
              <button key={c.key} className="sc-chip" onClick={() => removeChip(c.key)} aria-label={`Remove ${c.label}`}>
                {c.label} <span aria-hidden>×</span>
              </button>
            ))}
          </div>
        )}

        <div className="sc-body">
          {!hasQuery ? (
            /* estado inicial inteligente */
            <div className="sc-initial">
              {recent.length > 0 && (
                <div className="sc-group">
                  <div className="sc-glab">Recent</div>
                  {recent.map((r) => (<button key={r} className="sc-recent" onClick={() => setQ(r)}>↩ {r}</button>))}
                </div>
              )}
              <div className="sc-group">
                <div className="sc-glab">Top areas</div>
                {TOP_AREAS.map((a) => (
                  <button key={a.city} className="sc-recent" onClick={() => setQ(a.city)}>◍ {a.city} <span className="sc-count">{a.n} homes</span></button>
                ))}
              </div>
              <div className="sc-group">
                <div className="sc-glab">New to the collection</div>
                <div className="sc-newgrid">
                  {NEW_LISTINGS.map((p) => (
                    <button key={p.slug} className="sc-newcard" onClick={() => goListing(p.slug)}>
                      <span className="sc-thumb"><Image src={p.photo} alt="" fill sizes="120px" style={{ objectFit: 'cover' }} /></span>
                      <span className="sc-nc-price">{p.priceDisplay}</span>
                      <span className="sc-nc-addr">{p.address}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* resultados con imagen, en vivo */
            <div className="sc-results" role="listbox">
              {relaxedNote && <div className="sc-note">{relaxedNote}</div>}
              {results.map((p, i) => (
                <button key={p.slug} role="option" aria-selected={active === i}
                  className={`sc-res${active === i ? ' on' : ''}`} onMouseEnter={() => setActive(i)} onClick={() => goListing(p.slug)}>
                  <span className="sc-thumb"><Image src={p.photo} alt="" fill sizes="88px" style={{ objectFit: 'cover' }} /></span>
                  <span className="sc-res-main">
                    <span className="sc-res-addr">{p.address}</span>
                    <span className="sc-res-why">{why(p, filters)}</span>
                  </span>
                  <span className="sc-res-price">{p.priceDisplay}</span>
                </button>
              ))}
              <button className={`sc-seeall${active === results.length ? ' on' : ''}`} onMouseEnter={() => setActive(results.length)} onClick={seeAll}>
                See all {results.length} result{results.length === 1 ? '' : 's'} on the map →
              </button>
            </div>
          )}
        </div>

        <div className="sc-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>esc</kbd> close</span>
          <span className="sc-foot-r">Natural language · ⌘K</span>
        </div>
      </div>
    </div>
  );
}
