# TEMPLATE-AUDIT.md

Auditoría de acoplamiento del repo `Andrea-Larsen` (Next.js App Router) para convertirlo en
plantilla multi-agente. **Solo diagnóstico — no se modificó código.** Rutas relativas a la raíz.

Resumen ejecutivo:

- **`components/agent-data.ts` es la única fuente de verdad real** (identidad/contacto/oficina/
  social/compliance/calendly). El problema no es que no exista config, es que **~15 archivos la
  ignoran** y repiten los datos como strings literales (SEO, JSON-LD, contact page, mailto).
- **Las 20 propiedades están 100% hardcodeadas** en `lib/properties.ts` (+ `lib/geo.json`,
  `lib/gallery-manifest.json`, 556 fotos en `public/oc/`). No hay IDX conectado.
- **Existe un segundo dataset huérfano de PA/Maryland** (`components/listings-data.ts`, 10
  propiedades, otro board de MLS) fuera del flujo actual — legacy que confunde y hay que borrar.
- **Todo el copy geográfico y de marca (~65-70%) está atado a Andrea / Jersey Shore / Ocean City**,
  gran parte inline en JSX de ~20 componentes, no en config.
- **No hay logo, no hay og:image por defecto, y el dominio de deploy está hardcodeado en 8 sitios**
  (7× `project-625st.vercel.app` + 1× `andrea-larsen.vercel.app` inconsistente).
- **Bugs/inconsistencias a corregir antes de reusar** (ver §5).

---

## 1 · Auditoría de acoplamiento (Paso 1)

### a) Identidad

**Fuente de verdad — `components/agent-data.ts`:**

| Línea | Campo | Valor |
|---|---|---|
| 3 | `name` | `Andrea Larsen` |
| 4 | `brand` | `Love Living Coast2Coast` |
| 5 | `tagline` | `Helping You Love Where You Live` |
| 6 | `titles[]` | `REALTOR®, Luxury Property Specialist, Buyer's Agent, Listing Agent` |
| 7 | `licensedStates[]` | `Arizona, Florida, New Jersey` |
| 8 | `experience` | `27+ Years` |
| 9 | `rank` | `Top 1% in State` |
| 10 | `brokerage` | `Berkshire Hathaway HomeServices Fox & Roach` |
| 11 | `bio` | párrafo largo (`As a luxury realtor…`) |
| 14 | `photo` | `/andrea-perfil.jpg` |
| 16 | `avatar` | `/andrea-avatar.jpg` |
| 20-22 | `office.{name,address,phone}` | `…REALTORS®` / `730 West Avenue, Ocean City, NJ 08226` / `(609) 957-6787` |
| 24 | `market` | `Ocean City & the Jersey Shore` |
| 27-29 | `contact.{phone,sms,email}` | `856-448-2229` / `856-448-2229` / `andrea@lovelivingcoast2coast.com` |
| 30 | `contact.calendly` | `https://calendly.com/andrealarsen` |
| 31 | `vcard` | `https://card.get-card.com/…/Andrea-Larsen.vcf` |
| 33-38 | `social` | Instagram/Facebook/LinkedIn/YouTube/Linktree — todos `lovelivingcoast2coast` |

**Duplicados que NO leen de `agent` (a refactorizar):**

- `app/layout.tsx:50-54` — `telephone: '+1-856-448-2229'`, `email`, `streetAddress` literales en el JSON-LD.
- `app/contact/page.tsx:10,12` — teléfonos y dirección hardcodeados en el string de metadata.
- `app/properties/page.tsx:100` — `mailto:andrea@lovelivingcoast2coast.com` literal.
- `app/testimonials/page.tsx:22-24` — URLs de reputación del agente (Zillow `/profile/andrealarsen`, Google, `foxroach.com/bio/andrealarsen`).
- `components/descent/finale.tsx:19,51` y `hero-descent.tsx:178,194,269,354,383,386` — nombre, credenciales, alt, wordmark `andrea`.
- SEO por página con "Andrea Larsen" incrustado: `app/about/page.tsx:11`, `sell/page.tsx:11`, `collection/page.tsx:11`, `blog/page.tsx:11`, `blog/[slug]/page.tsx:20,38-39`, `blog/category/[category]/page.tsx:19`, `neighborhoods/[slug]/page.tsx:19`, `listing/[slug]/page.tsx:23`, `rss.xml/route.ts:22`.

### b) Listings

- **Única fuente en flujo:** `lib/properties.ts` — array `properties` con **20 propiedades** 100% hardcodeadas (líneas 54-311). Cada una: slug, mlsRef, address/city/state/zip, price/priceDisplay, beds/baths/sqft/lotAcres, status, type, photo (`/oc/oc-NN.jpg`), features[], description, `detailUrl`, `map:{x,y}`.
  - `:12-13` tipos `PropertyType` / `PropertyStatus`. `:15-37` `type Property`.
  - `:43-48` helper `gal(slug)` → `/oc/gal/<slug>/NN.jpg` vía `gallery-manifest.json`.
  - `:50` `const DET = 'https://andrealarsen.foxroach.com/realestate/details/'` (base del feed BHHS).
  - `:316` `flagship = properties[0]` (= 71 Morningside Road).
- **Coordenadas:** `lib/geo.json` — 20 entradas `{lat,lng}` (una por slug), rango lat 38.98-39.31 / lng −74.83-−74.54 (costa sur NJ).
- **Galerías:** `lib/gallery-manifest.json` — 20 entradas slug→nº fotos (total **556** JPG en `public/oc/gal/`). Fotos de portada: `public/oc/oc-01.jpg`…`oc-20.jpg`.
- **Just Sold:** `lib/home-sections.ts:23-26` — 4 direcciones reales OC (bajo contrato).
- **Dataset huérfano (fuera de flujo):** `components/listings-data.ts` — 10 propiedades **PA/Maryland** (Newtown PA, Bethesda MD…), CDN board `105605`, `DET` duplicado. Usado por `components/scroll-expand-real-estate.tsx`. **No lo consume la home actual — es legacy.**

### c) Geografía

- `lib/neighborhoods.ts` — 6 barrios NJ (`ocean-city`, `wildwood-crest`, `linwood`, `north-wildwood`, `egg-harbor-township`, `marmora`), cada uno con `name/tagline/vibe/bullets[]` llenos de topónimos NJ. **`:99` `listingsIn(name) = properties.filter(p => p.city === name)` — une por igualdad exacta `neighborhood.name === property.city`** (un typo rompe el join en silencio).
- `lib/properties.ts:319-325` — `AREA` (4 textos de zona atados a Ocean City: barrier island, boardwalk, Asbury Avenue, marinas). Render en `app/listing/[slug]/page.tsx:131` con eyebrow `The area — Ocean City` (`:129`).
- `components/studio/map-core.ts:13` — **`SHORE_CENTER = [-74.59, 39.28]`** (centro por defecto = Ocean City). `:68` zoom por defecto `11`. `:12` tiles `openfreemap.org/styles/positron` (sin token).
- `components/studio/properties-map.tsx:33` zoom inicial `10.4`; `:47-56` `fitBounds` **dinámico** sobre los pins (bien — se adapta si `geo.json` cambia), `maxZoom 13.2`, padding fijo.
- Topónimos NJ dispersos por UI: `footer-bits.tsx:5` (reloj `America/New_York`, "Ocean City, NJ"), `featured.tsx:81`, `marquee.tsx`, `mist.tsx`, `hero-search.tsx:232` (placeholder "123 Ocean Ave, Ocean City, NJ"), etc.

### d) Copy de marca

Estimado: **~65-70% atado a Andrea/Jersey Shore (reescribir por cliente)**, ~30-35% andamiaje UI reutilizable.

- **Tagline/brand:** `agent-data.ts:4-5`; `manifesto.tsx:62-63` y `footer-studio.tsx:14-15` (`Love where you live.`).
- **Manifesto "Quality — Trust — Legacy" / "The Larsen …":** `manifesto.tsx:58,70`, `footer-studio.tsx:12`, `quotes.tsx:70` (`The Larsen standard`), `about/page.tsx:17-19,90-93`. El apellido "Larsen" está literal en 6+ eyebrows.
- **Bio:** `agent-data.ts:11` + segundo párrafo `about/page.tsx:55-56`.
- **FAQ:** `faq.tsx:8-21` (⚠️ teléfono `561-888-3494` inconsistente en `:9`).
- **Testimonios/Just Sold:** `lib/home-sections.ts:15-26` (3 testimonios `sample:true` + 4 under-contract; el archivo advierte "no inventar").
- **Track record:** `track-record.tsx:9` `SAMPLE=true`, cifras `$180M+/300+/18/99%` (ilustrativas).
- **Headlines geo-específicos:** `featured.tsx:83` (`Life at the Jersey Shore`), `home-extras.tsx:71,110-111,194-197` (`Spoken for, already.`, `Six shores, one agent.`, `Your summer address awaits.`), `journal-home.tsx:30-31` (`Notes from the shore.`), `agent-editorial.tsx:21-22` (`The one who hands you the keys.`).
- **Hero beats:** `hero-descent.tsx:40-45` (`27 years. Top –1%.`, `Berkshire Hathaway HomeServices`), `:291` (`down to the Jersey Shore`), hotspots `:352-354` (⚠️ "Miami skyline / Penthouse level").
- **Quotes:** `quotes.tsx:13-17` (atributos genéricos de agente — reutilizables).
- **Blog:** `content/blog/*.md` — 3 posts **100% Jersey Shore** (impuestos NJ, salt air, flood, boardwalk). No reutilizables.

### e) Visual

- **Paleta — `app/studio.css:8-18` (`:root`):** `--st-bg #f4f4f2` · `--st-dark #0d0d0d` · `--st-card #141414` · `--st-lime #f4f4f2` · `--st-ink #1a1a1a` · `--st-grey #8a8a8a` · `--st-grey-dark #a0a0a0` · `--st-line #e5e5e1` · `--st-line-dark rgba(244,244,242,.14)` · `--st-mist #aeb9be` · `--st-plum #4e2a4f`.
  - **`#4E2A4F` (plum) duplicado a mano** en ~8 sitios en vez de `var(--st-plum)`: `sell/page.tsx:103,126`, `testimonials/page.tsx:60`, `contact/page.tsx:47`, `collection/page.tsx`, `home-extras.tsx:28`. Igual `#F4F4F2`/`#FCFCFA`/`#555`/`#4a5457` repetidos.
- **Tipografías — `app/layout.tsx:3,8-27`:** `Archivo` (eje variable `axes:['wdth']`, → `--font-grotesk`), `Instrument_Serif` (`--font-serif`), `Inter` (`--font-body`). **`font-stretch: 115%`** hardcodeado en `studio.css:35,185,217,261,262,283,353` + inline en `sell/page.tsx:103`, `testimonials/page.tsx:60`.
- **Hero/assets:** `hero-descent.tsx:23-25` (`FRAMES=160`, `SCRUB_VH=560`, `/descent/frames/f-NNN.webp`), `:178,194` `/descent/andrea-final.jpg` (⚠️ alt dice "Miami penthouse living room"). Fotos agente `agent-data.ts:14,16`. Fondos de sección: `manifesto.tsx:13` (`/oc/gal/210-gull-road/03.jpg`), `home-extras.tsx:190` (`/oc/gal/1-leyte-ln/03.jpg`). Legacy: `components/parallax-hero.tsx:37` (`/casa-hero.jpg`, ⚠️ alt "desert residence").
- **Logo:** **no existe.** `public/` no tiene `logo.*`; la marca "andrea" se renderiza como **texto** (`hero-descent.tsx:269`, `footer-bits.tsx:10`, `not-found.tsx:21`).
- **`public/` (751 archivos):** 160 frames del scrub, `andrea-final.jpg`, 20 portadas `oc/oc-NN.jpg`, 556 fotos en `oc/gal/` (20 subdirs), fotos de agente, `casa-hero.jpg`, `listings/casa-NN.jpg` (placeholders legacy).

### f) SEO y meta

- **Dominio hardcodeado (crítico):** 7× `https://project-625st.vercel.app` (`layout.tsx:30,49`, `sitemap.ts:6`, `robots.ts:6`, `rss.xml/route.ts:3`, `blog/[slug]/page.tsx:37,38`) **+ 1× inconsistente** `https://andrea-larsen.vercel.app` (`listing/[slug]/page.tsx:40`). Ninguno usa env var.
- `app/layout.tsx:32-41` title/description/openGraph (`siteName`, `locale:'en_US'`) — **sin `images` (no hay og:image por defecto)**.
- `app/layout.tsx:45-62` JSON-LD `RealEstateAgent` con NAP + `areaServed:[Ocean City NJ, Wildwood Crest NJ, …]` embebidos.
- `generateMetadata` por página con nombre/mercado literales: 11 archivos (`about`, `contact`, `sell`, `collection`, `testimonials`, `blog`, `blog/[slug]`, `blog/category`, `neighborhoods/[slug]`, `listing/[slug]`).
- `app/layout.tsx:65,73-77` — GA vía `process.env.NEXT_PUBLIC_GA_ID` (**correcto, por env**).
- JSON-LD schema.org: `RealEstateListing` (`listing/[slug]/page.tsx:36-43`, dominio inconsistente), `Article` (`blog/[slug]/page.tsx:36-47`).

### g) Legal

- **Fuente de verdad:** `agent-data.ts:25` `compliance: 'Equal Housing Opportunity. Licensed in New Jersey, Florida and Arizona.'`
- **Duplicados:** `contact/page.tsx:59` (compliance literal), `footer-studio.tsx:33` (`Equal Housing Opportunity · NJ · FL · AZ`), `finale.tsx:51` (`AZ · FL · NJ`), `home-sections.ts:41` (`Equal Housing Opportunity`).
- Estados de licencia hardcodeados como `NJ · FL · AZ` en footer/finale/faq. `faq.tsx:17` menciona además "Bucks County (PA) and Maryland".
- MLS/IDX/feed BHHS: `listing/[slug]/page.tsx:108` ("Property data from the BHHS Fox & Roach feed"), `properties/page.tsx:207` ("activate when the IDX feed connects"), `track-record.tsx:42`, `properties.ts:2-8,35` (comentarios de fuente).
- Copyright: `footer-studio.tsx:30` `©2026 {agent.name.toUpperCase()}`, `hero-descent.tsx:214` `© 2026`.
- Descripciones de las 20 propiedades: cada una contiene "Listed by Andrea Larsen with BHHS Fox & Roach".

### h) Integraciones

- **Calendly:** `agent-data.ts:30`. Consumido bien en 7 sitios; **hardcodeado** en `finale.tsx:34`, `hero-descent.tsx:343,389`.
- **WhatsApp:** `contact-form.tsx:57` y `quick-view.tsx:198` — `https://wa.me/1${agent.contact.phone…}` (derivado, bien).
- **Formularios = `mailto:` (sin backend):** `contact-form.tsx:35`, `valuation-form.tsx:39`, `blog/[slug]/page.tsx:80`, `testimonials/page.tsx:77`, `contact/page.tsx:47`, `footer-studio.tsx:50`. ⚠️ `properties/page.tsx:100` usa email literal.
- **Google Analytics:** `layout.tsx:65,73-77` vía `NEXT_PUBLIC_GA_ID` (env, no en `.env.local`; se inyecta en Vercel).
- **Feed externo BHHS:** `properties.ts:50` y `listings-data.ts:11` (`andrealarsen.foxroach.com/realestate/details/`), `listings-data.ts:10` + `scroll-expand-real-estate.tsx:43` (CDN `mediastg.net/…/mls/105605/`), `mist.tsx:13` (`SEARCH_BASE = andrealarsen.foxroach.com`).
- **Mapa:** `map-core.ts:12` OpenFreeMap (sin token). Comentario `:8`: para Mapbox hace falta token.
- **Secretos:** `.env.local:2` `VERCEL_OIDC_TOKEN` (único). **No hay `.env.example` ni `.env.production`.** No hay API keys de mapa ni de terceros en el código.
- **Config:** `package.json:2` `"name": "andrea-larsen"`; `next.config.js:5-7` `remotePatterns: **.mediastg.net, **.cloudfront.net, **.unsplash.com`.

---

## 2 · Inventario de "fuente de verdad" vs. dispersión

| Dato | Vive centralizado en | Nº de duplicados a refactorizar |
|---|---|---|
| Identidad / contacto / oficina / social / compliance / calendly | `components/agent-data.ts` | ~15 archivos (SEO, JSON-LD, contact, mailto, hero, finale) |
| Badges/credenciales home | `lib/home-sections.ts:38-43` (arrays sueltos, no derivan de `agent`) | — |
| Listings + URLs de feed | `lib/properties.ts` (+ dataset huérfano `listings-data.ts`) | DET/CDN en 4 archivos |
| Geografía | `lib/neighborhoods.ts` + `AREA` en `properties.ts` + `map-core.ts` | topónimos inline en ~15 componentes |
| Paleta / tipografía | `app/studio.css:8-21` + `app/layout.tsx:8-27` | plum/off-white/font-stretch literales en ~10 sitios |
| Dominio de deploy | **ninguno** (no hay env var) | 8 sitios |
| Copy de marca | parcialmente `agent-data.ts` / `home-sections.ts` | ~20 componentes con strings inline |

---

## 3 · Plan de configuración (Paso 3)

### 3.1 · Qué debe vivir en un archivo de config — `site.config.ts` propuesto

Un único módulo tipado, importado en todo el sitio, que reemplace `agent-data.ts` y absorba lo que
hoy está disperso (dominio, paleta, mapa, flags). Esquema propuesto:

```ts
// site.config.ts — fuente de verdad única por cliente
export interface SiteConfig {
  // — despliegue / SEO —
  site: {
    url: string;              // ← reemplaza los 8 hardcodes de dominio. Ej: 'https://andrealarsen.com'
    name: string;             // 'Andrea Larsen — Love Living Coast2Coast'
    titleTemplate: string;    // '%s | Andrea Larsen'
    defaultTitle: string;
    defaultDescription: string;
    locale: string;           // 'en_US'
    ogImage: string;          // '/og.jpg'  ← HOY NO EXISTE, hay que crearlo
    gaId?: string;            // se sigue leyendo de NEXT_PUBLIC_GA_ID; aquí solo fallback/doc
  };

  // — identidad —
  agent: {
    name: string; brand: string; tagline: string;
    titles: string[];         // ['REALTOR®', 'Luxury Property Specialist', …]
    experience: string;       // '27+ Years'
    rank: string;             // 'Top 1% in State'
    bio: string;
    photo: string;            // '/agent/perfil.jpg'
    avatar: string;           // '/agent/avatar.jpg' (crop cuadrado de cara)
    logo?: string;            // '/logo.svg'  ← HOY NO EXISTE
  };

  // — brokerage / oficina / legal —
  brokerage: {
    name: string;             // 'Berkshire Hathaway HomeServices Fox & Roach, REALTORS®'
    logo?: string;            // logo del brokerage (BHHS) — HOY NO EXISTE
    officeAddress: string;    // '730 West Avenue, Ocean City, NJ 08226'
    officePhone: string;      // '(609) 957-6787'
  };
  legal: {
    licensedStates: string[]; // ['New Jersey', 'Florida', 'Arizona']
    licenseNumbers?: Record<string, string>; // ← FALTA (no está en el repo). Ej: { NJ: '...' }
    compliance: string;       // 'Equal Housing Opportunity. Licensed in NJ, FL and AZ.'
    copyrightYear: number;
  };

  // — contacto / integraciones —
  contact: {
    phone: string; sms: string; email: string;
    whatsapp?: string;        // derivable de phone
    calendly?: string;
    vcard?: string;
  };
  social: { instagram?: string; facebook?: string; linkedin?: string; youtube?: string; linktree?: string };
  reviews?: { zillow?: string; google?: string; brokerBio?: string }; // testimonials/page.tsx:22-24

  // — mercado / mapa —
  market: {
    label: string;            // 'Ocean City & the Jersey Shore'
    state: string;            // 'NJ'
    timezone: string;         // 'America/New_York' (reloj del footer)
    mapCenter: [number, number]; // ← SHORE_CENTER. [-74.59, 39.28]
    mapDefaultZoom: number;   // 11
  };

  // — tema visual —
  theme: {
    colors: {                 // ← tokens de studio.css como fuente única
      bg: string; ink: string; grey: string; line: string;
      accent: string;         // plum '#4e2a4f' (hoy duplicado a mano en ~8 sitios)
      accentDark: string; mist: string; dark: string;
    };
    fonts: { display: string; serif: string; body: string; displayStretch: string }; // '115%'
  };

  // — feed / listings —
  feed: {
    provider: 'hardcoded' | 'idx' | 'cms';
    detailBaseUrl?: string;   // 'https://andrealarsen.foxroach.com/realestate/details/'
    mlsBoard?: string;        // '105320'
    cdnBase?: string;         // 'https://content.mediastg.net/dyna_images/mls/'
  };

  // — flags de secciones (qué aplica a este agente) —
  features: {
    rentals: boolean;         // hoy no hay inventario de renta
    newConstruction: boolean;
    has3DTour: boolean;       // flagship.tsx ya tiene la prop
    sampleTestimonials: boolean; // muestra chip "Sample" hasta tener reales
    sampleTrackRecord: boolean;  // track-record.tsx SAMPLE
    idxConnected: boolean;    // activa filtros waterfront/pool/año/HOA + alertas
  };
}
```

### 3.2 · Qué debe vivir en un CMS o base de datos

Contenido que cambia en el tiempo y por cliente, editable sin tocar código (candidato: Sanity/
Contentful, o al menos data files tipados por cliente):

- **Listings** mientras no haya IDX — hoy `lib/properties.ts` (20 objetos) + `lib/geo.json` + `lib/gallery-manifest.json`. Es lo que más se edita.
- **Testimonios** (`lib/home-sections.ts:15-17`) — con permiso del cliente; flag `sample`.
- **Just Sold / cierres** (`home-sections.ts:23-26`).
- **Track record** (`track-record.tsx` cifras) — cuando el agente entregue números verificados.
- **Guías de barrios** (`lib/neighborhoods.ts`) — 1 documento por barrio, texto factual local.
- **Blog** (`content/blog/*.md`) — ya es markdown+frontmatter; migrable a Sanity. Los 3 posts actuales NO se reutilizan (son 100% Jersey Shore).

### 3.3 · Qué debe venir del feed IDX/MLS (fuente a largo plazo)

Reemplaza a `lib/properties.ts` cuando se conecte:

- Propiedades: dirección, precio, beds/baths/sqft, status, tipo, MLS#, descripción, `detailUrl`.
- Fotos y galerías (hoy scrapeadas a `public/oc/gal/` vía `scripts/fetch-galleries.sh`).
- Coordenadas (hoy geocodificadas a mano en `geo.json` — el IDX suele traer lat/lng).
- Campos que hoy faltan y desbloquean filtros: waterfront/dock, año de construcción, HOA, piscina, vista (ver `properties/page.tsx:207`).
- Alertas de nuevas propiedades (hoy el "save search" es `mailto`).

### 3.4 · Qué NO se puede templatizar — trabajo manual por cliente (sin maquillar)

Esto **no** sale de un config. Requiere producción/redacción/decisión por cliente:

1. **El hero "The Descent" (video de drone + foto compuesta del agente).** Son 160 frames `.webp` generados con IA (Higgsfield/Seedance) más `andrea-final.jpg` compuesto a partir de fotos reales de Andrea. Cada agente necesita **su propia generación** (su cara, su mercado, su casa). Es el activo más caro y 100% bespoke. Además hoy el hero mezcla estética Miami/penthouse con el resto Jersey Shore — decisión de arte por cliente.
2. **Voz de marca / copy con carácter.** Tagline, el trío "Quality — Trust — Legacy", la bio, y los headlines que referencian el mercado ("Life at the Jersey Shore", "Six shores, one agent", "Your summer address awaits") son escritura a medida. Un config guarda el string, pero **alguien tiene que escribirlo** por agente/mercado.
3. **Guías de barrios.** Conocimiento local factual (Asbury Avenue, Hereford Inlet, doo-wop…) — investigación + redacción por mercado. No se genera solo.
4. **Blog.** Los 3 posts son NJ-específicos; hay que escribir nuevos por mercado (o dejar el blog vacío al lanzar).
5. **Logo.** No existe; hay que diseñarlo o pedir el del brokerage.
6. **Fotografía del agente.** Headshot profesional + crop de avatar. Producción física.
7. **Afinado del mapa.** Centro/zoom por mercado, y si el mercado es disperso (varias ciudades) el `fitBounds` puede verse mal — ajuste manual.
8. **Revisión de compliance por estado.** Disclaimers y logos requeridos varían por estado/brokerage — revisión legal, no templatizable.
9. **Decidir qué secciones aplican.** ¿El agente hace rentas? ¿preconstrucción? ¿tiene testimonios reales? — configuración humana, no automática.

---

## 4 · Riesgos al cambiar de mercado (Paso 4)

**Atado a NJ / geografía:**

- `map-core.ts:13` `SHORE_CENTER=[-74.59,39.28]` — en otro mercado el mapa arranca sobre Ocean City hasta cambiarlo. `fitBounds` es dinámico (se salva si `geo.json` se actualiza), pero el **estado vacío / fallback** apunta a NJ.
- `footer-bits.tsx:5` reloj en `America/New_York` — mercado en otra zona horaria muestra hora incorrecta.
- `neighborhoods.name` debe coincidir **exacto** con `property.city` (`listingsIn`, join por string). Un typo o un cambio de nombres deja barrios sin listings, en silencio.
- `AREA` (`properties.ts:319-325`) y los 6 `vibe/bullets` de `neighborhoods.ts` son texto local NJ — quedan absurdos en otro mercado hasta reescribir.

**Atado al número de propiedades (hoy 20):**

- `components/studio/featured.tsx` muestra 12; `map-section.tsx` lista las 20; Collections/mapa asumen ese orden. Con **pocos listings** (p.ej. 3) las secciones se ven vacías; con **cientos** no hay paginación (`properties/page.tsx` — ya anotado como pendiente IDX).
- `flagship = properties[0]` — el "flagship" es siempre el primero del array; sin curaduría puede ser cualquier cosa.
- Track record y stats (`$180M+`, `20+ residences`) son cifras fijas — mienten si el inventario real difiere.

**Atado a proporciones de imagen:**

- Hero full-bleed 21:10, cards 4:3, flagship slider 21:9, galería masonry, avatar cuadrado. Fotos nuevas que no respeten estos ratios se recortan mal. El scrub del hero exige **exactamente** una secuencia de frames del mismo tamaño.

**Atado a longitudes de texto / idioma:**

- El wordmark gigante "andrea" (`.st-hero-mark`) y "Andrea Larsen" en el hero están dimensionados para ~6-13 caracteres; nombres largos (p.ej. "Christopher Van Der Berg") desbordan.
- Los headlines usan `text-wrap: balance` y `st-line` con clip calibrado para frases concretas; frases más largas o en otro idioma pueden cortar descendentes o romper el salto de línea.
- Todo el copy y el blog están en **inglés**, `locale:'en_US'`. Un mercado hispano exige traducción completa.
- `font-stretch:115%` es específico de Archivo (eje `wdth`); cambiar de tipografía sin ese eje rompe el look.

**Atado al feed / integraciones:**

- `detailUrl` apunta a `andrealarsen.foxroach.com` → **links muertos** para un agente que no sea de ese portal BHHS.
- Patrón CDN `mediastg.net/…/mls/{board}/` con board `105320` (OC) — otro agente tiene otro board; `fetch-galleries.sh` hay que reconfigurarlo.
- Dominio `project-625st.vercel.app` en JSON-LD/sitemap/RSS → **canonical y og incorrectos** (mal SEO, previews rotos) hasta parametrizar.
- Compliance `NJ · FL · AZ` hardcodeado → **riesgo legal** si el agente opera en otro estado.

**Bugs / basura a limpiar antes de reusar:**

- `lib/properties.ts:100` — `"undefined bedrooms and undefined baths at 905-907 Brighton Pl…"` (interpolación fallida; la propiedad no tiene beds/baths).
- Teléfono huérfano `561-888-3494` en `faq.tsx:9` y `finale.tsx:47` — no coincide con los oficiales (`856-448-2229` / `609-957-6787`).
- Alts inconsistentes: `hero-descent.tsx:178` "Miami penthouse", `parallax-hero.tsx:37` "desert residence" — ni Miami ni desierto es Jersey Shore.
- Dominio inconsistente: `listing/[slug]/page.tsx:40` usa `andrea-larsen.vercel.app` vs. `project-625st.vercel.app` del resto.
- **Dataset huérfano PA/MD** (`components/listings-data.ts`, `scroll-expand-real-estate.tsx`, `parallax-hero.tsx`, `agent-section.tsx`, `finale.tsx`, `hero-parallax.tsx`) — componentes legacy fuera de flujo que duplican identidad y otra geografía. Decidir borrar o archivar.
- `public/listings/casa-NN.jpg` y `casa-hero.jpg` — placeholders legacy sin uso en la home actual.

---

## 5 · Orden sugerido para plantilizar (no ejecutado — solo recomendación)

1. Crear `site.config.ts` (§3.1) y **una** env var `NEXT_PUBLIC_SITE_URL`; migrar los 8 hardcodes de dominio y los ~15 duplicados de identidad a leer de config.
2. Borrar el dataset huérfano PA/MD y los componentes legacy (`listings-data.ts`, `scroll-expand-real-estate.tsx`, `parallax-hero.tsx`, `hero-parallax.tsx`, `agent-section.tsx`, `finale.tsx`, `public/listings/`, `public/casa-hero.jpg`).
3. Mover los literales de color/`font-stretch` a `var(--st-*)` y exponer los tokens desde `theme` del config.
4. Corregir los bugs de §4 (undefined beds, teléfono huérfano, alts, dominio inconsistente).
5. Extraer el copy inline geográfico a config/CMS; marcar qué se reescribe por cliente (§3.4).
6. Añadir `logo`, `og.jpg` y `.env.example`.
7. Documentar el pipeline del hero (Higgsfield) como paso manual por cliente.

Ver **ONBOARDING.md** para la lista exacta de lo que se le pide al agente nuevo, con formatos y fases.
