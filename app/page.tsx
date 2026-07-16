import HeroDescent from '@/components/descent/hero-descent';
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
import FooterStudio from '@/components/studio/footer-studio';

/*
 * Rediseño premium (referencias: Suffo + editorial claro + Nestoria).
 * El hero scroll-scrub queda intacto en su lógica; el resto de secciones son
 * el nuevo sistema "studio". Componentes previos (parallax-hero, hero-parallax,
 * listing-grid, agent-section, finale) permanecen en el repo, fuera de flujo.
 */

export default function Home() {
  return (
    <main className="st" id="top">
      {/* 1 · EL DESCENSO — intocable en su mecánica, overlay v2 */}
      <HeroDescent />

      {/* 2 · Value props */}
      <ValueProps />

      {/* 3 · Featured listings (grid editorial claro) */}
      <Featured />

      {/* 4 · Manifesto tipográfico + ficha técnica */}
      <Manifesto />

      {/* 5 · Stats con count-up */}
      <Stats />

      {/* 6 · Flagship $18.8M — expansión de imagen */}
      <Flagship />

      {/* 7 · Collections — índice negro con polaroid hover */}
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

      {/* 13 · CTA final + footer con wordmark lima */}
      <FooterStudio />
    </main>
  );
}
