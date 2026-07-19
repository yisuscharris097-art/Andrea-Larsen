'use client';

/** JournalHome — sección editorial de la home: índice de artículos con filas
 *  gigantes que expanden la imagen al hover. Los posts llegan del server
 *  (lib/blog es server-only), serializados a lo mínimo. */
import Image from 'next/image';
import Link from 'next/link';
import { Reveal, Line, Fade } from './ui';

export type JournalPost = {
  slug: string;
  title: string;
  category: string;
  dateDisplay: string;
  readMin: number;
  image: string;
  excerpt: string;
};

export default function JournalHome({ posts }: { posts: JournalPost[] }) {
  if (!posts.length) return null;
  return (
    <section className="st-light-s st-section" style={{ borderTop: '1px solid var(--st-line)' }}>
      <div className="st-wrap">
        <Reveal>
          <div className="jh-head">
            <div>
              <span className="st-eyebrow">The Journal</span>
              <h2 className="st-h2" style={{ margin: '1.1rem 0 0' }}>
                <Line i={0}>Notes from</Line>
                <Line i={1}><span className="st-it">the shore.</span></Line>
              </h2>
            </div>
            <Fade i={2}>
              <Link href="/blog" className="st-pill st-pill--solid" data-curtain="The Journal">
                Read the Journal →
              </Link>
            </Fade>
          </div>
        </Reveal>

        <Reveal>
          <div className="jh-list">
            {posts.map((p, i) => (
              <Fade key={p.slug} i={i}>
                <Link href={`/blog/${p.slug}`} className="jh-row" data-cursor="Read →" data-curtain={p.title}>
                  <div className="jh-top">
                    <span className="jh-num st-it" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <span className="jh-meta">{p.category} · {p.dateDisplay} · {p.readMin} min read</span>
                      <span className="jh-title">{p.title}</span>
                    </div>
                    <span className="jh-arrow" aria-hidden>→</span>
                  </div>
                  <div className="jh-media">
                    <div className="jh-media-in">
                      <div className="jh-img">
                        <Image src={p.image} alt="" fill sizes="(max-width: 760px) 92vw, 60vw" style={{ objectFit: 'cover' }} />
                      </div>
                      <p className="jh-excerpt">{p.excerpt}</p>
                    </div>
                  </div>
                </Link>
              </Fade>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
