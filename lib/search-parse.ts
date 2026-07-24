/**
 * search-parse — motor de búsqueda en lenguaje natural DETERMINISTA (EN + ES).
 * Traduce una frase ("waterfront under $3M with a dock") a filtros estructurados
 * y los aplica sobre las propiedades. Instantáneo, gratis, nunca se cuelga.
 *
 * El endpoint /api/search (Anthropic) es una mejora opcional: si está, refina el
 * parseo; si no, esto es el motor. Ver components/studio/search-command.tsx.
 *
 * ⚠️ Los conceptos (waterfront/dock/pool/beach) se matchean de forma DIFUSA contra
 *    features + description porque el feed actual no trae esos campos estructurados
 *    — llegan con IDX. Hoy: waterfront→"bay/bayside", beach→"near the beach", etc.
 */
import { properties, type Property } from './properties';

export type Filters = {
  maxPrice?: number;
  minBeds?: number;
  minBaths?: number;
  minSqft?: number;
  city?: string;
  type?: Property['type'];
  status?: Property['status'];
  concepts: string[]; // etiquetas legibles: 'Waterfront', 'Near the beach', 'New construction'…
  text?: string;      // resto libre (match sobre dirección/descr.)
};

export type Chip = { key: string; label: string };

export const CITIES = Array.from(new Set(properties.map((p) => p.city)));
const CITY_ALIASES: Record<string, string> = {
  'ocean city': 'Ocean City', 'oc': 'Ocean City',
  'wildwood crest': 'Wildwood Crest', 'crest': 'Wildwood Crest',
  'north wildwood': 'North Wildwood',
  'linwood': 'Linwood',
  'egg harbor': 'Egg Harbor Township', 'egg harbor township': 'Egg Harbor Township', 'eht': 'Egg Harbor Township',
};
// concepto → regex que se prueba sobre "features + description + city"
const CONCEPTS: { label: string; kw: RegExp; match: RegExp }[] = [
  { label: 'Waterfront', kw: /water\s?front|frente al agua|frente al mar|bayfront|on the bay/i, match: /bay|water|dock|marina/i },
  { label: 'Bayside', kw: /bay\s?side|en la bah[íi]a|bay\b/i, match: /bay/i },
  { label: 'Near the beach', kw: /beach|playa|beachfront|by the (sea|ocean)|near the (sand|ocean)/i, match: /beach|ocean|sand|steps from/i },
  { label: 'Dock / boat', kw: /dock|muelle|boat|lancha|slip/i, match: /bay|dock|marina|water/i },
  { label: 'New construction', kw: /new construction|newly built|nueva construcci[óo]n|new build|brand new/i, match: /new construction|new build/i },
  { label: 'Investment', kw: /investment|inversi[óo]n|rental|rentar|renta|summer rental|income/i, match: /investment|rental|multi-?unit|income/i },
  { label: 'The Gardens', kw: /the gardens|gardens district/i, match: /gardens/i },
];
const NUM_WORDS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  uno: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9,
};

const toNum = (w: string) => NUM_WORDS[w.toLowerCase()] ?? parseInt(w, 10);

/** parsea "$3M", "3 million", "3,000,000", "2.5m" → número */
function parseMoney(raw: string): number | undefined {
  const m = raw.replace(/[, ]/g, '').match(/\$?(\d+(?:\.\d+)?)(m|k|mill?o?n(?:es)?)?/i);
  if (!m) return undefined;
  let n = parseFloat(m[1]);
  const unit = (m[2] || '').toLowerCase();
  if (unit.startsWith('m')) n *= 1_000_000;
  else if (unit === 'k') n *= 1_000;
  else if (n < 100) n *= 1_000_000; // "under 3" ⇒ 3M en este mercado
  return Math.round(n);
}

export function parseQuery(q: string): { filters: Filters; chips: Chip[] } {
  const s = ' ' + q.toLowerCase().replace(/\s+/g, ' ') + ' ';
  const f: Filters = { concepts: [] };
  const chips: Chip[] = [];

  // precio máximo: "under/below/less than/bajo/menos de $X"
  const priceM = s.match(/(?:under|below|less than|up to|max|bajo|menos de|hasta|debajo de)\s*\$?([\d.,]+\s*(?:m|k|mill?o?n(?:es)?)?)/i);
  if (priceM) { const v = parseMoney(priceM[1]); if (v) { f.maxPrice = v; chips.push({ key: 'maxPrice', label: `≤ $${(v / 1e6).toFixed(1).replace('.0', '')}M` }); } }

  // recámaras
  const bedM = s.match(/(\d+|one|two|three|four|five|six|seven|eight|nine|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve)[\s-]*(?:\+\s*)?(?:bed|bedroom|br|cuarto|rec[áa]mara|habitaci[óo]n|dormitorio)/i);
  if (bedM) { const n = toNum(bedM[1]); if (n) { f.minBeds = n; chips.push({ key: 'minBeds', label: `${n}+ beds` }); } }

  // baños
  const bathM = s.match(/(\d+|one|two|three|four|five|six|uno|dos|tres|cuatro|cinco|seis)[\s-]*(?:\+\s*)?(?:bath|ba\b|ba[ñn]o)/i);
  if (bathM) { const n = toNum(bathM[1]); if (n) { f.minBaths = n; chips.push({ key: 'minBaths', label: `${n}+ baths` }); } }

  // sqft
  const sqM = s.match(/([\d,]{3,})\s*(?:sq\s?ft|sqft|square feet|pies)/i);
  if (sqM) { const n = parseInt(sqM[1].replace(/,/g, ''), 10); if (n) { f.minSqft = n; chips.push({ key: 'minSqft', label: `${n.toLocaleString('en-US')}+ sq ft` }); } }

  // ciudad
  for (const [alias, city] of Object.entries(CITY_ALIASES)) {
    if (s.includes(' ' + alias + ' ') || s.includes(' in ' + alias) || s.includes(' en ' + alias)) {
      f.city = city; chips.push({ key: 'city', label: city }); break;
    }
  }

  // tipo
  if (/\b(house|casa|single family|single-family)\b/i.test(s)) { f.type = 'House'; chips.push({ key: 'type', label: 'House' }); }
  else if (/\b(condo|condominio|condominium)\b/i.test(s)) { f.type = 'Condo'; chips.push({ key: 'type', label: 'Condo' }); }
  else if (/\b(town\s?house|town\s?home)\b/i.test(s)) { f.type = 'Townhouse'; chips.push({ key: 'type', label: 'Townhouse' }); }
  else if (/\b(land|lot|lote|terreno|build)\b/i.test(s)) { f.type = 'Land'; chips.push({ key: 'type', label: 'Land' }); }

  // status
  if (/\bfor sale|en venta|available|disponible\b/i.test(s)) { f.status = 'For Sale'; chips.push({ key: 'status', label: 'For Sale' }); }

  // conceptos
  for (const c of CONCEPTS) {
    if (c.kw.test(s) && !f.concepts.includes(c.label)) {
      f.concepts.push(c.label);
      chips.push({ key: 'concept:' + c.label, label: c.label });
    }
  }

  return { filters: f, chips };
}

const conceptRe = (label: string) => CONCEPTS.find((c) => c.label === label)?.match;
const haystack = (p: Property) => [p.features.join(' '), p.description, p.city].join(' ');

function passes(p: Property, f: Filters): boolean {
  if (f.maxPrice && p.price > f.maxPrice) return false;
  if (f.minBeds && (p.beds || 0) < f.minBeds) return false;
  if (f.minBaths && (p.baths || 0) < f.minBaths) return false;
  if (f.minSqft && (p.sqft || 0) < f.minSqft) return false;
  if (f.city && p.city !== f.city) return false;
  if (f.type && p.type !== f.type) return false;
  if (f.status && p.status !== f.status) return false;
  const hs = haystack(p);
  for (const label of f.concepts) { const re = conceptRe(label); if (re && !re.test(hs)) return false; }
  return true;
}

/** orden de importancia (se relaja del MENOS importante al más importante) */
const RELAX_ORDER: (keyof Filters | `concept`)[] = ['minSqft', 'minBaths', 'concept', 'type', 'minBeds', 'status', 'city', 'maxPrice'];

export type SearchResult = { results: Property[]; relaxedNote?: string };

/** aplica filtros; si da 0, relaja el filtro menos importante hasta encontrar algo. */
export function applyFilters(f: Filters): SearchResult {
  let hits = properties.filter((p) => passes(p, f));
  if (hits.length > 0) return { results: rank(hits, f) };

  const relaxed: Filters = { ...f, concepts: [...f.concepts] };
  let lastLabel = '';
  for (const key of RELAX_ORDER) {
    if (key === 'concept') { if (relaxed.concepts.length) { lastLabel = relaxed.concepts.join(' + '); relaxed.concepts = []; } else continue; }
    else if (relaxed[key] != null) { lastLabel = friendly(key, relaxed[key] as number | string); (relaxed as Record<string, unknown>)[key] = undefined; }
    else continue;
    hits = properties.filter((p) => passes(p, relaxed));
    if (hits.length > 0) {
      return { results: rank(hits, f), relaxedNote: `Nothing matched “${lastLabel}” exactly — showing the closest.` };
    }
  }
  return { results: rank(properties, f), relaxedNote: 'Showing the full collection.' };
}

/** label legible de un filtro (para chips de relajación) */
function friendly(key: keyof Filters, v: number | string): string {
  switch (key) {
    case 'maxPrice': return `≤ $${(Number(v) / 1e6).toFixed(1).replace('.0', '')}M`;
    case 'minBeds': return `${v}+ beds`;
    case 'minBaths': return `${v}+ baths`;
    case 'minSqft': return `${Number(v).toLocaleString('en-US')}+ sq ft`;
    default: return String(v);
  }
}

/** ordena por precio desc; los que cumplen más filtros primero */
function rank(list: Property[], f: Filters): Property[] {
  return [...list].sort((a, b) => b.price - a.price);
}

/** razón corta de por qué coincide (para el resultado) */
export function why(p: Property, f: Filters): string {
  const bits: string[] = [];
  if (f.minBeds && p.beds) bits.push(`${p.beds} bd`);
  if (f.minBaths && p.baths) bits.push(`${p.baths} ba`);
  if (f.minSqft && p.sqft) bits.push(`${p.sqft.toLocaleString('en-US')} sq ft`);
  for (const label of f.concepts) { const re = conceptRe(label); if (re && re.test(haystack(p))) bits.push(label); }
  if (f.type) bits.push(p.type);
  if (bits.length === 0) bits.push(`${p.beds ? p.beds + ' bd · ' : ''}${p.city}`);
  return bits.slice(0, 3).join(' · ');
}
