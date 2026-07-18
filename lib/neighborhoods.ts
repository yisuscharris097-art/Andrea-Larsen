/**
 * Neighborhood guides — contenido factual de conocimiento general de la zona.
 * Market stats específicos ("precio promedio", tendencias) se agregan cuando
 * el cliente provea cifras verificables — no se inventan números.
 */

import { properties } from './properties';

export type Neighborhood = {
  slug: string;
  name: string;
  tagline: string;
  vibe: string;
  bullets: { k: string; d: string }[];
};

export const neighborhoods: Neighborhood[] = [
  {
    slug: 'ocean-city',
    name: 'Ocean City',
    tagline: "America's Greatest Family Resort",
    vibe:
      "An eight-mile barrier island that has been the Jersey Shore's family capital for over a century. Ocean City is famously a dry town — no bars, no liquor stores — which keeps its energy centered on beaches, bikes and the boardwalk. Homes range from classic shore colonials in the Gardens to bayfront moderns with dock access.",
    bullets: [
      { k: 'Beach & boardwalk', d: '2.5 miles of boardwalk with rides, mini-golf and Manco & Manco pizza; wide guarded beaches all summer.' },
      { k: 'Downtown', d: 'Asbury Avenue: boutiques, bakeries and BYOB dining a bike ride from every block.' },
      { k: 'On the bay', d: 'Back-bay marinas, kayak launches and sunset docks on the west side of the island.' },
      { k: 'Family calendar', d: 'Night in Venice boat parade, First Night, block parties — the town runs on traditions.' },
    ],
  },
  {
    slug: 'wildwood-crest',
    name: 'Wildwood Crest',
    tagline: 'Wide, free beaches and doo-wop charm',
    vibe:
      'The quiet end of the Wildwoods: a residential beach town famous for some of the widest free beaches in New Jersey and its preserved mid-century "doo-wop" motel architecture. Larger multi-bedroom homes near Pacific and Atlantic Avenues make it a favorite for extended families and rental investors.',
    bullets: [
      { k: 'The beach', d: 'Hundreds of yards of sand at low tide — free access, no beach tags required.' },
      { k: 'Bike culture', d: 'Morning bike laps on the seawall path toward Diamond Beach and the Cape May inlet.' },
      { k: 'Investment', d: 'Strong summer rental demand for large multi-bedroom homes near the beach.' },
      { k: 'Nearby', d: 'Ten minutes to Cape May’s Victorian district and ferry.' },
    ],
  },
  {
    slug: 'linwood',
    name: 'Linwood',
    tagline: 'The mainland side of the shore',
    vibe:
      "A leafy mainland community minutes from the shore bridges — where year-round living meets summer proximity. Tree-lined streets, the Linwood Bike Path on the old rail bed, and quick drives to Ocean City beaches make it the practical luxury choice for families who live at the shore all year.",
    bullets: [
      { k: 'Location', d: 'Minutes to the Ocean City bridge, Somers Point marinas and Shore Medical Center.' },
      { k: 'The bike path', d: 'The rail-trail spine of the town — run, bike or walk it end to end.' },
      { k: 'Year-round', d: 'Full-service community living: schools, golf at Linwood CC, quiet winters.' },
      { k: 'New construction', d: 'Creek View Lane and similar enclaves bring modern floor plans to the mainland.' },
    ],
  },
];

export const bySlugNb = (slug: string) => neighborhoods.find((n) => n.slug === slug);
export const listingsIn = (name: string) => properties.filter((p) => p.city === name);
