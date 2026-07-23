'use client';

/** HeroSearch — banda de búsqueda fija justo bajo el hero. Ubicación + precio +
 *  tipo → /properties con los filtros en la URL. El 70% llega a buscar, no a
 *  agendar. Ciudades y tipos derivados de los listings reales. */
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { properties } from '@/lib/properties';

const PRICE_MAX = [
  { label: 'Any price', v: '' },
  { label: 'Up to $2M', v: '2000000' },
  { label: 'Up to $3M', v: '3000000' },
  { label: 'Up to $4M', v: '4000000' },
  { label: 'Up to $6M', v: '6000000' },
];

export default function HeroSearch() {
  const router = useRouter();
  const [city, setCity] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [type, setType] = useState('');

  const cities = useMemo(() => Array.from(new Set(properties.map((p) => p.city))).sort(), []);
  const types = useMemo(() => Array.from(new Set(properties.map((p) => p.type))), []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = new URLSearchParams();
    if (city) q.set('city', city);
    if (maxPrice) q.set('maxPrice', maxPrice);
    if (type) q.set('type', type);
    const qs = q.toString();
    router.push(`/properties${qs ? `?${qs}` : ''}`);
  };

  return (
    <section aria-label="Search properties" className="hs-band">
      <form className="hs-form" onSubmit={submit}>
        <label className="hs-field">
          <span className="hs-lab">Location</span>
          <select value={city} onChange={(e) => setCity(e.target.value)} aria-label="Location">
            <option value="">All of the Jersey Shore</option>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <span className="hs-sep" aria-hidden />
        <label className="hs-field">
          <span className="hs-lab">Price</span>
          <select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} aria-label="Maximum price">
            {PRICE_MAX.map((p) => <option key={p.label} value={p.v}>{p.label}</option>)}
          </select>
        </label>
        <span className="hs-sep" aria-hidden />
        <label className="hs-field">
          <span className="hs-lab">Type</span>
          <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Property type">
            <option value="">Any type</option>
            {types.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <button type="submit" className="hs-go">Search {properties.length} listings →</button>
      </form>
    </section>
  );
}
