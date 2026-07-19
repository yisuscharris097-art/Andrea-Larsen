import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CATEGORIES, postsByCategory } from '@/lib/blog';
import { Reveal, Line, Fade } from '@/components/studio/ui';
import CursorFX from '@/components/studio/cursor-fx';
import Curtain from '@/components/studio/curtain';
import '../../../studio.css';

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }: { params: { category: string } }): Metadata {
  const c = CATEGORIES.find((x) => x.slug === params.category);
  if (!c) return {};
  return {
    title: `${c.name} — The Journal | Andrea Larsen`,
    description: `${c.name} from the Jersey Shore — insights by Andrea Larsen, BHHS Fox & Roach.`,
  };
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const c = CATEGORIES.find((x) => x.slug === params.category);
  if (!c) notFound();
  const posts = postsByCategory(c.slug);

  return (
    <main className="st st-light-s" style={{ minHeight: '100vh' }}>
      <CursorFX />
      <Curtain />

      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem clamp(1.25rem, 5vw, 6.5rem)' }}>
        <Link href="/blog" className="st-pill st-pill--dark" data-curtain="The Journal">← The Journal</Link>
        <Link href="/contact" className="st-pill st-pill--solid" data-curtain="Contact">Contact</Link>
      </nav>

      <header className="st-section" style={{ paddingTop: '2.5rem', paddingBottom: '2rem' }}>
        <Reveal>
          <span className="st-eyebrow">The Journal · Category</span>
          <h1 className="st-h1" style={{ margin: '1.2rem 0 0' }}>
            <Line i={0}><span className="st-it">{c.name}.</span></Line>
          </h1>
        </Reveal>
      </header>

      <section className="st-section" style={{ paddingTop: 0 }}>
        {posts.length === 0 ? (
          <p className="st-body">Nothing here yet — new articles land every month. <Link href="/blog" style={{ color: '#4E2A4F' }}>Back to all articles →</Link></p>
        ) : (
          <Reveal>
            <div className="st-grid-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem 1.6rem' }}>
              {posts.map((p, i) => (
                <Fade key={p.slug} i={i % 3}>
                  <Link href={`/blog/${p.slug}`} className="st-card-l" data-cursor="Read →">
                    <div className="ph st-skel" style={{ position: 'relative', aspectRatio: '16/10' }}>
                      <Image src={p.image} alt={p.title} fill sizes="30vw" style={{ objectFit: 'cover' }} />
                    </div>
                    <div className="meta" style={{ marginTop: '0.9rem' }}>{p.dateDisplay} · {p.readMin} min read</div>
                    <div className="name" style={{ color: '#4E2A4F' }}>{p.title}</div>
                  </Link>
                </Fade>
              ))}
            </div>
          </Reveal>
        )}
      </section>
    </main>
  );
}
