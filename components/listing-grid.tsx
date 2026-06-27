'use client';
import Image from 'next/image';
import Link from 'next/link';
import type { Listing } from './listings-data';

/**
 * ListingGrid — TODAS las propiedades visibles y seleccionables (clicables).
 * Cada tarjeta abre el detalle del listing. Blanco + oxblood, sans pesada.
 */
export const ListingGrid = ({ listings }: { listings: Listing[] }) => {
  return (
    <section className="bg-paper px-4 md:px-8 py-20 md:py-32">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink pb-5 mb-12 md:mb-16">
          <div>
            <span className="inline-flex items-center gap-3 text-ox font-bold uppercase tracking-[0.26em] text-[0.72rem]">
              <span className="w-8 h-px bg-ox" /> Browse the Collection
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-ink mt-3">
              All {listings.length} Residences
            </h2>
          </div>
          <span className="text-ink/45 text-[0.7rem] uppercase tracking-[0.2em]">
            Select any home to view
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 md:gap-x-10 md:gap-y-16">
          {listings.map((l, i) => (
            <Link
              key={i}
              href={l.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block focus:outline-none"
            >
              <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-[#e7e0d6] shadow-[0_16px_44px_-24px_rgba(26,23,20,0.45)] transition-all duration-500 group-hover:shadow-[0_34px_80px_-32px_rgba(26,23,20,0.5)] ring-1 ring-transparent group-focus-visible:ring-2 group-focus-visible:ring-ox group-focus-visible:ring-offset-2">
                <Image
                  src={l.thumbnail}
                  alt={l.title}
                  width={900}
                  height={600}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 text-white font-extrabold text-xs tracking-wider bg-ox/90 rounded-full px-3 py-1">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {l.banner && (
                  <span className="absolute top-4 right-4 text-white text-[0.6rem] uppercase tracking-[0.18em] bg-ink/80 rounded-full px-3 py-1">
                    {l.banner}
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <div className="pt-4 flex items-baseline justify-between gap-3">
                <p className="text-2xl md:text-3xl font-extrabold tracking-tight text-ink">{l.price}</p>
                <span className="text-ox text-sm font-bold opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  View &rarr;
                </span>
              </div>
              <p className="text-ink font-semibold mt-1">{l.title}</p>
              {l.specs && <p className="text-ink/55 text-sm mt-1">{l.specs}</p>}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
