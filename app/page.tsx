import HeroDescent from '@/components/descent/hero-descent';
import GateRelease from '@/components/descent/gate-release';
import Flagship from '@/components/descent/flagship';
import ValueProps from '@/components/studio/value-props';
import Featured from '@/components/studio/featured';
import Manifesto from '@/components/studio/manifesto';
import Stats from '@/components/studio/stats';
import Collections from '@/components/studio/collections';
import Mist from '@/components/studio/mist';
import MapSection from '@/components/studio/map-section';
import AgentEditorial from '@/components/studio/agent-editorial';
import Quotes from '@/components/studio/quotes';
import Faq from '@/components/studio/faq';
import Marquee from '@/components/studio/marquee';
import { TestimonialsHome, JustSold, NeighborhoodsHome, HowItWorks, PressAwards, FinalCta } from '@/components/studio/home-extras';
import CursorFX from '@/components/studio/cursor-fx';
import Curtain from '@/components/studio/curtain';
import ContactForm from '@/components/studio/contact-form';
import FooterStudio from '@/components/studio/footer-studio';
import JournalHome from '@/components/studio/journal-home';
import { allPosts } from '@/lib/blog';

/*
 * Rediseño premium (referencias: Suffo + editorial claro + Nestoria).
 * El hero scroll-scrub queda intacto en su lógica; el resto de secciones son
 * el nuevo sistema "studio". Componentes previos (parallax-hero, hero-parallax,
 * listing-grid, agent-section, finale) permanecen en el repo, fuera de flujo.
 */

export default function Home() {
  const journalPosts = allPosts().slice(0, 3).map((p) => ({
    slug: p.slug,
    title: p.title,
    category: p.category,
    dateDisplay: p.dateDisplay,
    readMin: p.readMin,
    image: p.image,
    excerpt: p.excerpt,
  }));
  return (
    <main className="st" id="top">
      <CursorFX />
      <Curtain />
      {/* 1 · EL DESCENSO — intocable en su mecánica, overlay v2 */}
      <HeroDescent />
      {/* libera el gate si la home monta ya scrolleada (volver desde una propiedad) */}
      <GateRelease />

      {/* 2 · Value props */}
      <ValueProps />

      {/* 3 · Featured listings (grid editorial claro) */}
      <Featured />

      {/* NUEVA · Testimonials (se muestra al cargar contenido real) */}
      <TestimonialsHome />

      {/* NUEVA · Just Sold (se muestra al cargar contenido real) */}
      <JustSold />

      <Marquee />

      {/* 4 · Manifesto tipográfico + ficha técnica */}
      <Manifesto />

      {/* 5 · Stats con count-up */}
      <Stats />

      {/* 6 · Flagship $18.8M — expansión de imagen */}
      <Flagship />

      {/* NUEVA · Neighborhoods */}
      <NeighborhoodsHome />

      {/* NUEVA · How it works */}
      <HowItWorks />

      {/* NUEVA · Press & Affiliations */}
      <PressAwards />

      {/* 7 · Collections — índice con polaroid hover */}
      <Collections />

      {/* 8 · Respiro gris-azulado + búsqueda */}
      <Mist />

      {/* 9 · Mapa estilizado */}
      <MapSection />

      {/* 10 · La agente */}
      <AgentEditorial />

      {/* 11 · El estándar Larsen (quotes drag) */}
      <Quotes />

      {/* 12 · FAQ */}
      <Faq />

      {/* NUEVA · The Journal — índice editorial del blog */}
      <JournalHome posts={journalPosts} />

      <Marquee />

      {/* 13 · Contacto */}
      <ContactForm />

      {/* NUEVA · Final CTA banner */}
      <FinalCta />

      {/* 14 · CTA final + footer con wordmark */}
      <FooterStudio />
    </main>
  );
}
