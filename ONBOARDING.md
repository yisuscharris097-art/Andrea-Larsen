# ONBOARDING.md

Lista exacta de lo que hay que pedirle a un agente nuevo para levantar su sitio con esta
plantilla. Derivada de la auditoría de acoplamiento (ver `TEMPLATE-AUDIT.md`).

**Cómo leer cada ítem:**
- **Qué / para qué** — dónde se usa en el código.
- **Formato** — especificación exacta (dimensiones, tipo de archivo, límite de caracteres, ejemplo válido).
- **[BLOQUEANTE]** = sin esto no se puede lanzar · **[OPCIONAL]** = mejora, no frena.
- **Fallback** — qué hacemos si no lo tenemos al lanzar.

Convención de imágenes en todo el doc: **JPG/WebP, sRGB, < 400 KB tras optimizar** (el repo usa `sips -Z … q70/q84`). Nunca PNG para fotos.

---

## FASE 1 — Primera llamada (lo mínimo para arrancar)

Sin estos ítems no se puede ni maquetar la home. Todos **[BLOQUEANTE]** salvo aviso.

### 1.1 Identidad básica
- **Nombre completo** como aparece en la licencia y cómo quiere que se muestre. → `agent.name`. Formato: texto, ideal ≤ 22 caracteres (el wordmark gigante del hero se dimensiona para nombres cortos; nombres muy largos desbordan — ver riesgo en TEMPLATE-AUDIT §4). Ej: `Andrea Larsen`.
- **Marca / eslogan de negocio** (si tiene). → `agent.brand`, `agent.tagline`. Formato: brand ≤ 30 car., tagline ≤ 40 car. Ej: `Love Living Coast2Coast` / `Helping You Love Where You Live`. **Fallback:** usar `Nombre + Real Estate` como brand y una tagline genérica de rol.
- **Títulos / designaciones.** → `agent.titles[]`. Ej: `REALTOR®, Luxury Property Specialist`. **Fallback:** `REALTOR®`.
- **Años de experiencia y ranking demostrable.** → `agent.experience`, `agent.rank`. Formato: strings cortos. Ej: `27+ Years`, `Top 1% in State`. **Fallback [OPCIONAL]:** omitir el stat; el strip de números usa lo que haya.

### 1.2 Contacto
- **Celular, teléfono de oficina, email.** → `contact.phone` / `office.phone` / `contact.email`. Formato: teléfono US `856-448-2229` y `(609) 957-6787`; email válido. **El email es [BLOQUEANTE]**: todos los formularios envían por `mailto:` a esa dirección (no hay backend). Sin email no hay captación de leads.
- **WhatsApp sí/no.** → se deriva del celular (`wa.me/1…`). **Fallback:** ocultar el botón de WhatsApp.

### 1.3 Brokerage, oficina y legal
- **Brokerage exacto + dirección de oficina + teléfono.** → `brokerage.name`, `office.address`, `office.phone`. Ej: `Berkshire Hathaway HomeServices Fox & Roach, REALTORS®` / `730 West Avenue, Ocean City, NJ 08226`. **[BLOQUEANTE]** (aparece en footer, contacto, JSON-LD).
- **Estados donde está licenciado + números de licencia.** → `legal.licensedStates[]`, `legal.licenseNumbers`. Formato: `['New Jersey','Florida','Arizona']` + `{ NJ: '...' }`. ⚠️ **Los números de licencia NO están hoy en el repo — pedirlos.** **[BLOQUEANTE para el estado principal]**: el disclaimer de compliance dice los estados; uno equivocado es riesgo legal.
- **Texto de compliance exigido por el brokerage** (Equal Housing, disclaimers). → `legal.compliance`. **Fallback:** `Equal Housing Opportunity. Licensed in <estados>.` (el estándar actual).

### 1.4 Mercado y geografía
- **Ciudad(es)/mercado principal + estado + zona horaria.** → `market.label`, `market.state`, `market.timezone`. Ej: `Ocean City & the Jersey Shore`, `NJ`, `America/New_York`. **[BLOQUEANTE]** (el reloj del footer y todo el copy geográfico dependen de esto).
- **Centro del mapa (coordenadas del área).** → `market.mapCenter [lng,lat]`. Ej: `[-74.59, 39.28]`. **Fallback:** geocodificar la ciudad principal (1 vez).

### 1.5 Al menos 1 propiedad + foto del agente (para que la home no se vea vacía)
- **Foto profesional del agente (headshot).** → `agent.photo` + `agent.avatar` (recorte cuadrado de cara). Formato: **vertical mín. 1200×1600 px** (ratio 3:4) para `photo`; de ahí sacamos el avatar cuadrado. JPG. **[BLOQUEANTE]**: la sección "The agent" y los avatares de las fichas la usan. **Fallback:** placeholder gris con iniciales (se ve claramente incompleto).
- **Mínimo 1 listing real** (idealmente 6-12) con: dirección, precio, beds/baths/sqft, status, tipo, y fotos. → `lib/properties.ts` / futuro feed. **[BLOQUEANTE]**: sin listings, Featured/mapa/collection quedan vacíos. **Fallback:** ver Fase 2; se puede lanzar con "coming soon" pero no es ideal.

> **Regla de honestidad (heredada del proyecto):** no se inventan testimonios, ventas, estadísticas ni premios. Lo que el agente no pueda demostrar se etiqueta como `Sample` o no se publica.

---

## FASE 2 — Después del "sí" (contenido para que el sitio se sienta completo)

Se puede lanzar sin todo esto, pero el sitio se ve a medias. Recolectar en una carpeta compartida.

### 2.1 Inventario completo
- **Todos los listings activos** con MLS# de cada uno. → con el MLS# resolvemos fotos y datos del feed. Formato por propiedad: dirección completa, precio, beds/baths/sqft, status (`For Sale`/`Pending`), tipo (`House`/`Condo`/`Townhouse`/`Land`), MLS#. **[BLOQUEANTE para /properties útil]**.
- **Fotos por propiedad** (o autorización para usar las del MLS). Formato: JPG horizontales, mín. 1400 px lado largo. Se optimizan a q70. Portada + galería (hoy hasta 40 por propiedad).
- **Coordenadas** (si el feed no las trae, geocodificamos las direcciones 1 vez). → `lib/geo.json`.
- **Cuál es la propiedad estrella** (flagship del hero/sección). **Fallback:** se usa la primera del array (`properties[0]`).
- **Propiedades vendidas / bajo contrato** que pueda demostrar, con precio si lo permite. → sección "Just Sold". **Fallback:** ocultar la sección (no inventar cierres).

### 2.2 Marca visual
- **Logo** (del agente o del brokerage). → `agent.logo` / `brokerage.logo`. Formato: **SVG** (preferido) o **PNG transparente ≥ 512 px de alto**. ⚠️ **HOY NO EXISTE ningún logo en el repo — la marca es texto.** **[OPCIONAL pero muy recomendado]**: un logo reconocible da autoridad. **Fallback:** wordmark de texto con el nombre (lo actual).
- **Paleta de marca** (si tiene) o construimos identidad. → `theme.colors`. Formato: hex por token (accent/bg/ink/mist…). Ej actual: plum `#4E2A4F`, off-white `#F4F4F2`, mist `#AEB9BE`. **Fallback:** paleta actual (plum/off-white/mist).
- **2-3 referencias visuales** (sitios que le gusten, de cualquier rubro). **[OPCIONAL]** — orienta el diseño.
- **og:image** (imagen para compartir en redes). Formato: **1200×630 px** JPG. ⚠️ **HOY NO EXISTE.** **Fallback:** generar una con el logo/nombre sobre foto de portada.

### 2.3 Copy de marca (se escribe con el agente — no sale de un formulario)
- **Bio** (o los 5 datos que quiere que todo cliente sepa). → `agent.bio`. Formato: 1 párrafo, 400-900 caracteres. **Fallback:** plantilla de bio con sus datos (experiencia/mercado/brokerage).
- **Manifesto / valores** (el sitio actual usa "Quality — Trust — Legacy"). → varias secciones. **Fallback:** trío genérico o quitar la sección.
- **Barrios/zonas que trabaja** para las guías. → `lib/neighborhoods.ts`. Formato: por barrio, nombre (= debe coincidir EXACTO con el `city` de sus listings), tagline (≤ 45 car.), párrafo `vibe` (300-600 car.), 4 bullets. **⚠️ crítico:** el nombre del barrio se une a los listings por igualdad exacta de string. **Fallback:** guías factuales básicas por ciudad, o quitar la sección.

### 2.4 Prueba social (solo real)
- **Testimonios reales con permiso escrito**, o links a sus reviews (Zillow/Google/perfil brokerage). → `lib/home-sections.ts` + `reviews`. **Fallback:** entradas `sample:true` con chip visible "Sample" (lo actual) hasta tener reales.
- **Cifras de producción** (volumen vendido, # transacciones, días en mercado, % sobre lista). → `track-record.tsx`. **Fallback:** cifras ilustrativas con chip `Sample` + disclaimer (lo actual). **No se publican como reales sin verificar.**

### 2.5 Integraciones
- **Link de agenda (Calendly o similar).** → `contact.calendly`. **Fallback:** el botón "Agendar" cae al email/teléfono.
- **Redes activas** (Instagram/Facebook/LinkedIn/YouTube). → `social`. **Fallback:** ocultar los iconos que falten.
- **vCard** (opcional). → `contact.vcard`.

---

## FASE 3 — Post-lanzamiento (se completa con el tiempo)

No frena el lanzamiento; se conecta después.

- **Dominio propio.** → `site.url` + DNS a Vercel. Formato: `https://sudominio.com`. **Fallback:** subdominio `*.vercel.app` (hay que actualizarlo en config para SEO correcto — hoy está hardcodeado, ver TEMPLATE-AUDIT §f).
- **Google Analytics (GA4).** → env var `NEXT_PUBLIC_GA_ID` en Vercel. Formato: `G-XXXXXXXXXX`. **Fallback:** sin analytics (el script no se inyecta si falta).
- **CRM** (Follow Up Boss, kvCORE…) para recibir leads. **Hoy los formularios son `mailto:`.** **Fallback:** los leads llegan por email hasta integrar CRM.
- **Feed IDX/MLS** — reemplaza los listings hardcodeados y activa: filtros waterfront/piscina/año/HOA, paginación y alertas automáticas de nuevas propiedades. Requiere: proveedor IDX (SimplyRETS/IDX Broker), MLS board id, y credenciales. **Fallback:** listings curados a mano.
- **Blog** — posts propios del mercado. **Fallback:** blog vacío al lanzar (los 3 posts actuales son de Jersey Shore, no se reutilizan).
- **Video de hero "The Descent"** (drone + foto compuesta del agente con IA). Es producción a medida por agente (Higgsfield/Seedance): su cara, su mercado. **Fallback:** hero estático con foto del agente hasta producir el video.

---

## Checklist rápido de bloqueantes (para lanzar)

```
[ ] Nombre + cómo mostrarlo
[ ] Email (los formularios dependen de él)
[ ] Celular + oficina + brokerage + dirección
[ ] Estados de licencia + Nº de licencia (estado principal) + compliance
[ ] Mercado principal + estado + zona horaria + centro de mapa
[ ] Foto profesional del agente (3:4, ≥1200×1600)
[ ] Al menos 1 listing real con foto (idealmente 6-12)
[ ] Dominio o subdominio confirmado
```

Todo lo demás (logo, og:image, testimonios reales, cifras verificadas, guías de barrios, blog,
IDX, CRM, video de hero) puede empezar como fallback y completarse después — con la regla firme
de **no publicar como real nada que el agente no pueda demostrar**.
