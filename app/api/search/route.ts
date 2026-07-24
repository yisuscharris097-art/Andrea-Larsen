/**
 * POST /api/search — traduce lenguaje natural → filtros estructurados.
 *
 * • Si existe ANTHROPIC_API_KEY: usa Claude para parsear frases complejas.
 * • Si no (o si falla / tarda): cae al parser determinista (lib/search-parse).
 *
 * El cliente NUNCA depende de esto para responder: renderiza con el parser
 * determinista al instante y, si quiere, llama aquí para refinar. Ver
 * components/studio/search-command.tsx. Con IDX y miles de propiedades, el
 * filtro se aplica igual — solo cambia la fuente de datos.
 */
import { NextResponse } from 'next/server';
import { parseQuery, CITIES, type Filters } from '@/lib/search-parse';

export const runtime = 'nodejs';

const SYSTEM = `You translate a real-estate search phrase into JSON filters. Reply with ONLY a JSON object, no prose.
Schema: { "maxPrice"?: number, "minBeds"?: number, "minBaths"?: number, "minSqft"?: number, "city"?: string, "type"?: "House"|"Condo"|"Townhouse"|"Land", "status"?: "For Sale"|"Pending", "concepts"?: string[] }
Rules: prices are USD absolute numbers (e.g. "under 3M" => maxPrice 3000000). city must be one of: ${CITIES.join(', ')} (omit if none). concepts is a short list of tags like "Waterfront","Near the beach","Dock / boat","New construction","Investment". Omit any field you are unsure about.`;

async function claudeParse(q: string, key: string): Promise<Filters | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 3500); // nunca colgar
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: SYSTEM,
        messages: [{ role: 'user', content: q }],
      }),
      signal: ctrl.signal,
    });
    if (!r.ok) return null;
    const data = await r.json();
    const text: string = data?.content?.[0]?.text || '';
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) return null;
    const parsed = JSON.parse(m[0]);
    return { concepts: [], ...parsed } as Filters;
  } catch {
    return null; // timeout / error → fallback
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(req: Request) {
  let q = '';
  try { q = (await req.json())?.q || ''; } catch { /* noop */ }
  q = String(q).slice(0, 200).trim();
  if (!q) return NextResponse.json({ filters: { concepts: [] }, source: 'empty' });

  const key = process.env.ANTHROPIC_API_KEY;
  if (key) {
    const ai = await claudeParse(q, key);
    if (ai) return NextResponse.json({ filters: ai, source: 'llm' });
  }
  // fallback determinista (siempre disponible)
  return NextResponse.json({ filters: parseQuery(q).filters, source: 'deterministic' });
}
