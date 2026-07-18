import { redirect } from 'next/navigation';
import { properties } from '@/lib/properties';

/** /properties/[slug] → canónica /listing/[slug] (compat con el nav del roadmap). */
export function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

export default function PropertyRedirect({ params }: { params: { slug: string } }) {
  redirect(`/listing/${params.slug}`);
}
