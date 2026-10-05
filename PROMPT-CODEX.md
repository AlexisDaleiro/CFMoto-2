# Prompt para Codex — Demo web CFMOTO Uruguay

## Rol

Actuá como diseñador web senior y arquitecto front-end con 20 años de experiencia en sitios de marcas de vehículos (motos, ATV, automotriz). Tomás decisiones de diseño con criterio editorial, escribís código de producción limpio y medís todo lo que afirmás. No hacés plantillas: cada pantalla tiene una razón.

## Contexto

CFMOTO Uruguay (distribuidor oficial, showroom en Barra de Carrasco, Canelones) tiene hoy un sitio en WordPress + Elementor (https://cfmotouruguay.com) con estos problemas medidos:

- Pesa 3,2 MB en 46 recursos y tarda ~3,3 s en cargar; el slider del home aparece vacío mientras carga.
- No tiene `<h1>` ni meta description. Las imágenes del slider tienen alt "slider1…slider5". SEO prácticamente nulo.
- Errores de contenido (la ficha de la 450SR muestra la foto de un CFORCE 450).
- Navegación confusa, sin precios, sin un camino claro a "quiero esta moto".

Vamos a presentarle al cliente una **demo navegable** del sitio nuevo para cotizar el proyecto completo. La demo tiene que ser, a la vista y en métricas, lo opuesto al sitio actual: rápida, fluida, hermosa en el celular y pensada para captar clientes.

## Objetivo de la demo

1. Que el cliente diga "esto es CFMOTO" en los primeros 3 segundos en un celular.
2. Que cualquier visitante llegue a "Cotizar" o "WhatsApp" de un modelo en 2 toques desde el home.
3. Que Lighthouse móvil dé ≥ 95 en Performance, ≥ 95 en Accesibilidad y 100 en SEO.
4. Que **no parezca hecha por una IA ni con una plantilla** (ver sección "Anti-IA", es obligatoria).

## Alcance

### Dentro

- Home.
- Página de línea: Motos, Cuatriciclos, UTV.
- Ficha de producto **completa** para 3 modelos estrella: 800MT Touring, CFORCE 1000, ZFORCE 1000 Sport.
- Ficha **básica** para el resto del catálogo, con el mismo template (las secciones sin datos no se renderizan).
- Página Cotizar / Test ride.
- 404 propia.

### Fuera (no construir, no dejar scaffolding "para después")

Checkout, carrito, cuentas de usuario, CMS, comparador, simulador de financiación, mapa de concesionarios, blog/noticias, multi-idioma, analytics, banner de cookies, personalización por usuario.

El sitio debe poder crecer a ecommerce headless (Shopify/Medusa) más adelante. Eso se garantiza con datos tipados, slugs estables y un único módulo de acceso a datos — nada más.

## Stack y reglas técnicas

- **Next.js** última versión estable, App Router, React 19, **TypeScript estricto**, **Tailwind CSS v4**. npm.
- Todas las páginas se generan estáticas (`generateStaticParams`, `dynamicParams = false` en rutas dinámicas).
- Server Components por defecto. Client Components **solo** para: header (scroll + menú), selector de color, filtro de cilindrada, botones de carrusel y formulario.
- **Cero dependencias de UI o animación.** Nada de shadcn, Radix, Framer Motion/Motion, GSAP, Lenis, Swiper, Embla ni librerías de íconos. Carruseles con CSS scroll-snap, acordeones con `<details>`, íconos como SVG inline (solo los funcionales: menú, cerrar, flecha, WhatsApp).
- Imágenes con `next/image` (AVIF/WebP), `sizes` correctos en cada uso, `priority` solo en la imagen LCP de cada página.
- Fuente con `next/font/google`, una sola familia variable, subset latin, `display: swap`.
- Sin scripts de terceros. Sin iframes (Google Maps va como link, no embebido).
- Antes de usar cualquier API de Next/React que dependa de versión (View Transitions, metadata, etc.), verificá la documentación de la versión instalada.

### Estructura

```
src/
  app/
    layout.tsx            # html lang="es-UY", fuente, header, footer, JSON-LD de la empresa
    page.tsx              # home
    [linea]/page.tsx      # motos | cuatriciclos | utv
    [linea]/[modelo]/page.tsx
    cotizar/page.tsx
    not-found.tsx
    sitemap.ts
    robots.ts
    globals.css           # tokens, base, view transitions, scroll reveals
  components/             # un archivo por componente, nombres en kebab-case
  content/
    lineas.ts
    modelos.ts
    sitio.ts              # contacto, horarios, redes, talleres
  lib/
    catalogo.ts           # ÚNICO punto de acceso a datos: getLineas, getLinea, getModelos, getModelo, getRelacionados
    seo.ts                # helpers de metadata y JSON-LD
    whatsapp.ts           # arma el link wa.me con mensaje por modelo
public/images/{linea}/{slug}/...
```

### Modelo de datos

```ts
export type Linea = "motos" | "cuatriciclos" | "utv";

export type Modelo = {
  slug: string;              // kebab-case estable, ej. "800mt-touring"
  linea: Linea;
  nombre: string;            // nombre oficial, ej. "800MT Touring"
  cilindradaCc: number;
  potenciaHp?: number;
  torqueNm?: number;
  pesoKg?: number;
  precioDesdeUsd?: number;   // DEMO: valor de referencia, ver DEMO-NOTES.md
  destacado?: boolean;       // true = ficha completa
  bajada: string;            // una línea, concreta, con un dato
  imagenes: { hero: string; perfil: string; galeria?: string[] };
  colores?: { nombre: string; hex: string; imagen: string }[];
  keySpecs?: { etiqueta: string; valor: string; unidad?: string }[]; // exactamente 4
  features?: { titulo: string; texto: string; imagen: string }[];
  specs?: { grupo: string; filas: [string, string][] }[];
};
```

Las especificaciones salen **solo** de las páginas oficiales de cfmoto.com (global, LatAm o EE.UU.). Nunca inventes una cifra técnica: si no la encontrás, dejá el campo vacío y la sección no se muestra.

## Catálogo (según el sitio actual de CFMOTO Uruguay)

| Línea | Cilindrada | Modelos |
|---|---|---|
| Motos | 150 | 150NK |
| | 250 | 250NK |
| | 300 | 300SR, 300NK |
| | 400 | 400NK, 400GT |
| | 450 | 450SR |
| | 650 | 650MT, 650NK, 650GT, 650TR-G |
| | 700 | 700CL-X Heritage, 700CL-X Sport |
| | 800 | **800MT Touring** (destacado), 800MT Sport |
| Cuatriciclos | 400 | CFORCE 450S |
| | 500 | CFORCE 520L |
| | 600 | CFORCE 625, CFORCE 625 Touring |
| | 800 | CFORCE 850XC |
| | 1000 | **CFORCE 1000** (destacado), CFORCE 1000 Overland |
| UTV | 500 | ZFORCE 550EX |
| | 600 | UFORCE 600 |
| | 1000 | UFORCE 1000, UFORCE 1000 XL, **ZFORCE 1000 Sport** (destacado) |

Rutas: `/motos/800mt-touring`, `/cuatriciclos/cforce-1000`, `/utv/zforce-1000-sport`, y así para todos (slug = nombre en kebab-case).

### Datos reales del negocio (`content/sitio.ts`)

- Showroom: Ruta 101 y Calcagno, Barra de Carrasco, Canelones.
- Horario: lunes a viernes 09:00–13:00 y 14:00–18:30; sábados 09:00–13:00.
- Teléfonos: 098 379 380, 098 379 379, 091 092 095. Email: cfmotouruguay@gmail.com.
- WhatsApp de la demo: +598 98 379 380 (a confirmar con el cliente).
- Redes: facebook.com/CFMOTOUY, instagram.com/cfmotouruguay, youtube.com/channel/UCyX1skEIAyV34wnAb4n1rfw.
- Red de service (agrupar por departamento):
  - Montevideo: Credibikerss (Mercedes 1789, 097 530 690), Cafe Race (Av. Rivera 4406 esq. Ambrosio Velazco, 093 947 771), Allroad (Av. Italia 4001, 2618 1180), Bikeup (Comercio 1950, 2508 818\*).
  - Maldonado: Motos Punta (Arturo Santana esq. 19 de Abril, 4224 5163).
  - Cerro Largo: Yelton Motos (Mata 300 esq. Oribe, Melo, 099 591 074), Multimotos Hogar (Aparicio Saravia 675, Melo, 091 367 598).
  - Paysandú: Francisco Automotores (Bulevar Artigas esq. Uruguay, 4723 4844).
  - Salto: MYM (Av. Gobernador de Viana 675, 2508 8185\*).
  - Colonia: Automercado (Ruta 1 km 128.500, Radial Rosario, 4552 1483).

\* Teléfonos que parecen incompletos o duplicados en el sitio actual: cargarlos igual y listarlos en DEMO-NOTES.md para confirmar.

## Imágenes

1. Buscá las páginas oficiales de cada modelo en cfmoto.com y descargá las imágenes de mayor resolución disponibles: hero/ambiente, perfil lateral sobre fondo limpio, una por color y 4–6 de galería/features para los 3 destacados.
2. Guardalas localmente en `public/images/{linea}/{slug}/` con nombres fijos: `hero.jpg`, `perfil.png`, `color-{nombre}.png`, `galeria-01.jpg`, … Máximo 2400 px de ancho. **No hacer hotlinking.**
3. Descargá el logo oficial de CFMOTO en SVG.
4. Registrá cada archivo en `IMAGES.md`: ruta local, URL de origen y qué falta.
5. Si no hay acceso a la red o falta una imagen, usá un componente `ImagenPendiente`: bloque grafito con la proporción exacta y el nombre del modelo en tipografía outline. Nunca uses fotos de stock ni de otras marcas.

## Dirección de arte

**Mixta:** el hero, los paneles de línea y el footer van en negro con fotos a sangre completa (energía Harley-Davidson / Indian). Las fichas y los bloques de contenido van en off-white cálido, aireados y editoriales (Maeving / Royal Enfield). El ritmo oscuro/claro entre secciones es parte del diseño.

Referencias y qué tomar de cada una (tomar la idea, no copiar el layout):

- royalenfield.com: imágenes enormes; ficha con selector de color que cambia la moto.
- cfmoto.com (página de CFORCE C6 Pro): producto presentado en grande, recortado sobre fondo limpio.
- maeving.com: aire, tipografía grande, sobriedad, detalle editorial. Es la referencia principal de "calidad percibida".
- motoshop.com.uy: primer viewport que deja elegir categoría de inmediato.
- indianmotorcycle.com: cada línea presentada como un panel fotográfico grande. **No** usar paneles laterales deslizables con formularios.
- harley-davidson.com/la: primer viewport con impacto; ficha con precio, colores, specs clave y features.

### Tokens (en `globals.css` con `@theme` de Tailwind v4)

- `--color-ink: #0B0C0D` (fondo oscuro), `--color-graphite: #17191B`, `--color-steel: #2B2E31`
- `--color-bone: #F3F1EC` (fondo claro), `--color-paper: #FAF9F6`
- `--color-mute: #8B9095`, líneas 1 px con `currentColor` al 12–16 %
- `--color-accent`: el azul oficial de CFMOTO, extraído del CSS o del logo de cfmoto.com (fallback `#0089D0`). **Solo** se usa en CTAs primarios, estados activos y foco. Nunca en fondos grandes ni en texto largo.
- Radios: 0 en todo; máximo 2 px en inputs.
- Sin sombras. La separación se resuelve con color de fondo, espacio y líneas de 1 px.

### Tipografía

Una sola familia variable con eje de ancho: **Archivo** (wght + wdth) vía `next/font`.

- Display: ancho ~75, peso 800, mayúsculas, interlineado 0,88–0,92, tracking −0,01 em. Tamaños con `clamp()`; en el hero llega hasta ~14vw en mobile y puede cortarse contra el borde de la foto.
- Texto: ancho 100, peso 400/500, 16–18 px, interlineado 1,5, largo de línea máx. 65ch.
- Micro-labels: 11–12 px, mayúsculas, tracking 0,12 em, color mute (ej. `01 — MOTOS`, `DESDE`, `CILINDRADA`).
- Cifras siempre con `font-variant-numeric: tabular-nums`.

### Grilla y espacio

- Mobile first: 4 columnas, gutter de 16 px y margen lateral de 16 px a 360 px de ancho. 8 columnas desde 768 px y 12 desde 1024 px. Contenido máx. 1440 px; las fotos hero van a sangre.
- Escala de espacio en múltiplos de 8. Los paddings de sección **varían** según el contenido (no todas las secciones miden lo mismo).
- Composición asimétrica: textos alineados a una columna, imágenes que se desfasan, tipografía que se superpone a la foto.

## Anti-IA (obligatorio)

Prohibido:

- Hero centrado con título + subtítulo + dos botones simétricos.
- Degradés de color, fondos violeta/azul, glassmorphism, blur, glow, blobs, patrones de puntos o grillas decorativas, ruido. Única excepción: un scrim negro → transparente sobre fotos, solo para legibilidad.
- Grillas de 3 o 4 cards iguales con ícono + título + texto. Íconos decorativos en features.
- Cards redondeadas con sombra suave. Badges tipo "Nuevo ✨". Emojis en cualquier lugar.
- Testimonios inventados, estadísticas falsas ("+10.000 clientes felices"), logos de prensa, lorem ipsum.
- Animar todo con fade-up. El movimiento se reserva para momentos clave.
- Copy genérico: "Descubrí", "Viví la experiencia", "inigualable", "libertad sin límites", "llevá tu aventura al siguiente nivel", "pasión", "potencia y estilo", signos de exclamación.

Obligatorio (detalles que hace un humano con oficio):

- Numeración editorial de secciones (`01 / Motos`, `02 / Cuatriciclos`…), líneas de 1 px y micro-labels.
- Pies de foto breves en la galería ("Tablero TFT de 7" con conectividad").
- Cifras grandes y concretas en lugar de adjetivos.
- Crops de imagen variados: a sangre completa, desfasados, con el producto recortado sobre fondo claro.
- Estados de hover/focus/active diseñados, no los que vienen por defecto.

## Copy

- Español rioplatense de **Uruguay**, con voseo ("Cotizá", "Agendá tu test ride", "Escribinos").
- Frases cortas. Siempre un dato concreto (cc, HP, Nm, kg, capacidad de carga, tracción). Cero adjetivos vacíos.
- Contexto local cuando suma: ruta, balasto, campo, monte, arroyo, barro, costa. Cuatriciclos y UTV le hablan también al trabajo de campo; las motos, a la ruta y a la ciudad.
- Ejemplos del tono (verificá todas las cifras contra la ficha oficial):
  - "Del asfalto al balasto sin bajarte."
  - "Tracción 4x4 y 1000 cc para lo que pida el campo."
  - "Cotizá la 800MT Touring. Te respondemos en el día."
- CTAs: "Cotizar", "Agendar test ride", "Escribinos por WhatsApp", "Ver modelos". Nunca "Saber más" ni "Click aquí".

## Páginas

### Global: header y footer

- Header fijo, transparente sobre el hero y sólido (ink) al scrollear. Se esconde al bajar y reaparece al subir. Logo a la izquierda.
- Mobile: botón de menú que abre un menú a pantalla completa con las 3 líneas en tipografía display enorme, cada una con su miniatura, más Cotizar y WhatsApp.
- Desktop: Motos / Cuatriciclos / UTV con un panel desplegable que lista los modelos de la línea agrupados por cilindrada, con miniatura y "desde USD". Más un CTA "Cotizar" en acento.
- Footer en ink: líneas, modelos destacados, contacto, horarios, redes, red de service y la nota legal de precios.
- Skip link "Saltar al contenido".

### Home `/`

1. **Hero** a 100svh: foto de la 800MT Touring a sangre. Título display abajo a la izquierda, una línea de bajada con dato y CTA primario "Ver la 800MT" + CTA secundario de texto "Cotizar".
   - Pegada al borde inferior del primer viewport, una **barra de líneas** (Motos / Cuatriciclos / UTV) con miniatura, visible sin scrollear en un celular de 390 × 844.
2. **Líneas:** tres paneles fotográficos a sangre, uno por línea, con numeración, nombre display, cantidad de modelos y "desde USD X". El panel completo es el link.
3. **Destacados:** carrusel horizontal con scroll-snap de los 3 modelos estrella, recortados sobre fondo bone, con 3 cifras clave cada uno. En desktop lleva botones prev/next.
4. **La marca:** bloque claro y editorial con datos reales (fundada en 1989 en Hangzhou, más de 70 países, I+D propia). Texto breve y una foto grande.
5. **Service en todo el país:** "10 talleres en 6 departamentos", lista agrupada por departamento con dirección y teléfono clickeable (`tel:`).
6. **Cierre:** fondo ink, "Agendá tu test ride" + WhatsApp.

### Línea `/[linea]`

- Hero de la línea: foto a sangre, nombre display y una frase con dato.
- Chips de cilindrada (Todas, 150, 250…) que filtran en cliente y reflejan el filtro en la URL (`?cc=650`) sin recargar.
- Grilla de modelos: perfil recortado sobre bone, nombre, cc, HP y "desde USD". Mobile: 1 columna para destacados y 2 para el resto. Desktop: 3–4 columnas.
- La imagen de cada card participa en la transición compartida hacia la ficha.
- Breadcrumb visible y en JSON-LD.

### Ficha `/[linea]/[modelo]`

Orden para los destacados (los modelos con ficha básica muestran solo las secciones que tengan datos):

1. **Hero:** imagen grande del modelo, nombre display, bajada, "Desde USD X" y CTAs "Cotizar" + WhatsApp.
2. **Selector de color:** swatches que cambian la imagen de perfil con crossfade y muestran el nombre del color. Accesible con teclado (radio group).
3. **4 cifras clave** en tipografía display: cilindrada, potencia, torque y peso (o capacidad de carga en UTV).
4. **Galería** con scroll-snap y pies de foto.
5. **Features:** 3–5 bloques de imagen + texto alternados, con composición asimétrica (no repetir el mismo layout en todos).
6. **Especificaciones completas:** grupos en `<details>` (Motor, Transmisión, Chasis, Dimensiones, Electrónica), con tabla de dos columnas y cifras tabulares.
7. **Relacionados:** 3 modelos de la misma línea.
8. **Cierre:** "Agendá tu test ride de la {modelo}".

En mobile: **barra fija inferior** con "Cotizar" (acento) y WhatsApp. Aparece cuando el CTA del hero sale de la pantalla y respeta `env(safe-area-inset-bottom)`.

### Cotizar `/cotizar`

- Lee `?modelo={slug}` y precarga el modelo, mostrando miniatura y nombre.
- Formulario corto:
  - Nombre, teléfono (validación de celular uruguayo: `09X XXX XXX` o `+598`) y modelo (select agrupado por línea).
  - Opcionales: departamento (select de los 19) y checkbox "Quiero agendar un test ride".
- Validación nativa más mensajes propios accesibles (`aria-describedby`, `aria-invalid`).
- Envío **simulado** en la demo: una server action `enviarCotizacion` que valida y devuelve ok. Debe tener un comentario de una línea indicando dónde conectar el CRM o el email.
- Estado de éxito diseñado (no un alert), con el siguiente paso claro y el link de WhatsApp.
- Al costado (desktop) o debajo (mobile): showroom, horarios, teléfonos y link "Cómo llegar" a Google Maps.

### WhatsApp

`lib/whatsapp.ts` arma `https://wa.me/59898379380?text=...` con un mensaje precargado según el contexto: "Hola, quiero cotizar la CFMOTO 800MT Touring" en la ficha y "Hola, quiero info sobre cuatriciclos CFMOTO" en la línea. Abre en pestaña nueva con `rel="noopener"`.

## Movimiento

La sensación de "experiencia única" sale del movimiento y del cuidado del detalle, no de personalizar contenido.

- **Transiciones entre páginas** con View Transitions API, usando la integración oficial de Next/React de la versión instalada. Si no está disponible, hacé un wrapper mínimo de `document.startViewTransition` sobre la navegación interna. Sin librerías.
  - Por defecto: crossfade + desplazamiento vertical de 12 px, 280 ms, `cubic-bezier(.2,.8,.2,1)`.
  - **Elemento compartido:** la imagen del modelo en la card (home/línea) se transforma en la imagen del hero de la ficha (`view-transition-name: modelo-{slug}`).
  - El nombre del modelo también hace morph del listado al hero.
  - Sin soporte en el navegador: navegación instantánea, sin errores.
- **Reveals al scrollear** con CSS scroll-driven animations (`animation-timeline: view()`) dentro de `@supports`. Sin soporte, el contenido se ve normal. Usarlos solo en: títulos de sección, cifras clave y las imágenes de features.
- **Microinteracciones:** hover de cards con un leve zoom de la imagen (scale 1.03, 400 ms) y subrayado animado en links de texto. Los swatches de color reaccionan al press.
- `prefers-reduced-motion: reduce` desactiva transiciones y reveals.
- Prohibido: smooth scroll falso, parallax pesado, cursores custom, loaders o splash screens.

## SEO

- `<html lang="es-UY">`. Metadata por página con plantilla `%s | CFMOTO Uruguay`, canonical, Open Graph y Twitter con la imagen hero del modelo o de la línea.
- Títulos y descriptions únicos, con la keyword principal al inicio. Descriptions de 140–160 caracteres.
- Un solo `<h1>` por página. Jerarquía de headings correcta. HTML semántico (`header`, `nav`, `main`, `section` con heading, `footer`).
- Alt descriptivos: "CFMOTO 800MT Touring color Nebula Black, vista lateral".
- `sitemap.ts` generado desde el catálogo y `robots.ts`.
- JSON-LD:
  - `MotorcycleDealer` (layout): nombre, dirección, teléfono, horarios y `sameAs` con las redes.
  - `BreadcrumbList` en línea y ficha.
  - `Product` en ficha: brand CFMOTO, imagen, descripción y `Offer` en USD.
- Mapa de keywords:

| Página | Keyword principal | Secundarias |
|---|---|---|
| Home | motos CFMOTO Uruguay | concesionario CFMOTO, CFMOTO Montevideo, cuatriciclos y UTV Uruguay |
| /motos | motos CFMOTO Uruguay | moto adventure Uruguay, moto naked, moto 650 / 800 cc |
| /cuatriciclos | cuatriciclos Uruguay | cuatriciclo 4x4, cuatriciclo para campo, ATV Uruguay |
| /utv | UTV Uruguay | side by side Uruguay, UTV 4x4 para campo |
| Ficha | CFMOTO {modelo} Uruguay | precio {modelo} Uruguay, {modelo} ficha técnica |
| /cotizar | cotizar moto CFMOTO | test ride CFMOTO Uruguay |

## Performance (presupuesto, se mide al final)

- LCP < 2,0 s, CLS < 0,05 e INP < 200 ms en Lighthouse móvil (4G simulado).
- JS inicial del home < 120 KB gzip. Sin CSS sin usar en cantidad.
- Imagen hero < 250 KB en mobile. Todas las imágenes con `width`/`height` o `fill` + contenedor con aspect-ratio (cero saltos de layout).
- Fuente: un solo archivo variable, con preload.

## Accesibilidad

Contraste AA, foco visible en acento, navegación completa por teclado (menú, desplegables, selector de color, acordeones, formulario), áreas táctiles de 44 px como mínimo, `aria-expanded`/`aria-controls` en toggles y menú mobile con focus trap y cierre con Esc.

## Orden de trabajo

1. Scaffold de Next + Tailwind v4 + tokens + fuente + layout base.
2. `content/` y `lib/catalogo.ts` con todo el catálogo. Descarga de imágenes e `IMAGES.md`.
3. Header y footer.
4. **Ficha de producto** (la página más importante: dejarla impecable primero con la 800MT Touring).
5. Página de línea.
6. Home.
7. Cotizar.
8. View Transitions y reveals.
9. SEO (metadata, JSON-LD, sitemap, robots).
10. Pase de performance y accesibilidad. Medir y corregir hasta cumplir el presupuesto.
11. Documentación.

## Definición de terminado

- [ ] `npm run build` y `npm run lint` sin errores ni warnings. TypeScript estricto sin `any`.
- [ ] Revisado en 360, 390, 768, 1280 y 1920 px de ancho, sin scroll horizontal en ninguno.
- [ ] Lighthouse móvil en home, `/motos` y `/motos/800mt-touring`: Performance ≥ 95, Accesibilidad ≥ 95, SEO 100, Best Practices ≥ 95.
- [ ] Todo CTA de modelo lleva a `/cotizar?modelo=…` o a WhatsApp con el mensaje correcto.
- [ ] La transición card → ficha funciona en Chrome y Safari y degrada sin errores en Firefox.
- [ ] Ningún punto de la lista "Anti-IA" se incumple. Revisá cada pantalla contra esa lista antes de cerrar.

## Entregables

- Código en este repo.
- `README.md`: cómo correr en local y cómo deployar en Vercel.
- `IMAGES.md`: inventario de imágenes con origen y faltantes.
- `DEMO-NOTES.md`:
  - Qué es simulado (precios de referencia, envío del formulario).
  - Datos a confirmar con el cliente (WhatsApp, teléfonos dudosos).
  - Tabla **antes/después** con las métricas del sitio actual (3,2 MB, ~3,3 s, sin H1, sin meta description) contra las medidas de la demo.
