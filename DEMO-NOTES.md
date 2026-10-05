# Notas de la demo CFMOTO Uruguay

Preparada el 5 de octubre de 2026. Es una demo navegable para presentación; la definición de terminado del prompt tiene pendientes indicados abajo.

## Qué está implementado

Home, las tres líneas, las 27 fichas del catálogo, Cotizar/Test ride, 404, sitemap y robots. Páginas estáticas, datos tipados, fuentes oficiales locales, metadata, JSON-LD, filtros con URL e historial, menú por teclado, colores en CFORCE 1000, galerías, acordeones, transiciones nativas y barra móvil de cotización.

`npm run build`, `npm run lint` y TypeScript pasan. La verificación recorre 45 combinaciones de nueve rutas con anchos 360, 390, 768, 1280 y 1920; sin desbordes horizontales. Comprueba las 32 páginas del sitemap, el formulario, la precarga por modelo/test ride, historial, colores, menú y CTA fijo. Evidencia: `artifacts/verification.json` y `artifacts/screenshots/`.

Chrome, Firefox y WebKit pasan la transición card → ficha, el recorrido de foco del menú y el cierre con Esc. Se prueba también navegación sin `document.startViewTransition` y con movimiento reducido. WebKit es una comprobación del motor; Safari real en iPhone/macOS queda pendiente. Versiones y resultados en `artifacts/browser-verification.json`.

## Simulaciones y datos a confirmar

- Todos los precios en USD son referencias inventadas para mostrar la interfaz. No provienen del distribuidor, no indican stock ni constituyen ofertas comerciales. Se identifican como demo en pantalla y en la descripción de Product/Offer.
- El formulario valida en el servidor y devuelve éxito simulado. No envía, almacena ni agenda consultas; la pantalla lo explica. El paso siguiente es el enlace de WhatsApp. No hay CRM, email ni base de datos conectados.
- Confirmar WhatsApp +598 98 379 380 antes de publicar.
- Confirmar Bikeup: 2508 818, aparentemente incompleto; MYM Salto: 2508 8185, posiblemente duplicado o incorrecto. Se conservaron los valores del prompt.
- Dirección, horarios, teléfonos, redes y talleres fueron aportados por el prompt. Confirmarlos con el distribuidor; no se verificaron con una llamada ni con un mensaje.
- Confirmar disponibilidad, equipamiento, año y homologación de cada versión para Uruguay. Las especificaciones consultadas son de versiones internacionales y la ficha lo aclara.
- El acento usa el fallback solicitado `#0089D0`; confirmar el manual de marca del distribuidor. El logo SVG sí es oficial.
- Antes del despliegue, configurar `NEXT_PUBLIC_SITE_URL`, recompilar y comprobar canonical, sitemap y datos estructurados en el dominio final. No se realizó ningún despliegue.

## Fuentes y límites del catálogo

Hay datos técnicos y recursos oficiales para 13 modelos. Para los otros 14 se conserva el nombre y segmento comercial del catálogo aportado, con ImagenPendiente y sin cifras técnicas ni tablas inventadas. `segmentoCc` alimenta los filtros; `cilindradaCc` es opcional y se carga únicamente si hay una fuente técnica. Ejemplo: segmento 600, cilindrada verificada 580 cc en CFORCE 625. Esta distinción evita publicar la agrupación nominal como cilindrada real.

Las fuentes por modelo están en `src/content/modelos.ts`; el inventario completo y sus faltantes están en `IMAGES.md`. No se usan fotografías de otro modelo para cubrir faltantes.

- 800MT Touring: datos y fotografías del folleto internacional oficial de 2021. Tiene cuatro cifras, cinco imágenes de galería, tres features y cinco grupos técnicos. El perfil transparente disponible es de solo 325 × 217 px: necesita un original mayor para escritorio. No se encontró una imagen exacta por color de buena resolución; se omitió el selector.
- CFORCE 1000: cuatro cifras, cuatro colores con sus fotografías, galería, tres features y especificaciones oficiales. La página global contiene una discrepancia entre el texto comercial (85 HP) y su tabla técnica (71 HP); se usó la tabla, con 963 cc y 71 Nm. El cliente debe confirmar la versión local.
- ZFORCE 1000 Sport: queda como ficha básica. No se encontró una ficha técnica ni un conjunto de imágenes del modelo exacto en las fuentes oficiales permitidas. ZFORCE 950 Sport y ZFORCE 1000 Sport R son variantes distintas y no se sustituyeron. La tercera ficha estrella completa es un pendiente de contenido.
- Cuando una fuente expresa potencia en kW, se convierte a HP mecánicos con 1 kW = 1,34102209 HP y se redondea a un decimal. Las tablas conservan el valor y unidad de origen.
- Los datos institucionales de 1989, Hangzhou e I+D provienen de la página global de la marca. Se usa su dato actual de presencia en más de 100 países/regiones, superior al mínimo mencionado en el prompt.

## Mediciones

Los resultados finales se registran abajo a partir de Lighthouse 13 sobre la compilación de producción local, en Chrome, con emulación móvil y throttling simulado. No son una medición de usuarios reales ni garantizan el resultado de un hosting futuro. Los reportes HTML/JSON conservan los parámetros exactos.

El sitio actual respondió HTTP 403 durante la investigación. Sus valores de 3,2 MB, 46 recursos, aproximadamente 3,3 s y ausencia de H1/description son los suministrados por `PROMPT-CODEX.md`; no se presentan como una medición nueva. Tiempo de carga informado y LCP son métricas diferentes.

<!-- METRICS -->

| Página | Performance | Accesibilidad | Best Practices | SEO | LCP | CLS | TBT | Transferencia total |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| / | 94 | 100 | 100 | 100 | 3.09 s | 0.0000 | 42 ms | 384.4 KB |
| /motos | 96 | 100 | 100 | 100 | 2.78 s | 0.0000 | 52 ms | 347.1 KB |
| /motos/800mt-touring | 94 | 100 | 100 | 100 | 2.95 s | 0.0000 | 129 ms | 372.0 KB |

Última auditoría: 2026-10-05T21:31:58.142Z. Se conserva la última ejecución completa, sin seleccionar únicamente los mejores valores.

| Dato | Sitio actual, informado en el prompt | Demo, medido en el home |
|---|---|---|
| Transferencia | 3,2 MB | 0.38 MB |
| Carga / LCP | ~3,3 s de carga, método no informado | 3.09 s de LCP simulado |
| H1 | Ausente | Un H1 por página |
| Meta description | Ausente | Única, 140–160 caracteres, en las 32 páginas |

JS inicial del home: **145.2 KB gzip**. Se suman los archivos únicos script[src] presentes en el HTML inicial, recomprimidos con gzip, excluyendo el polyfill noModule que Chrome moderno no ejecuta y las precargas de otras rutas. El objetivo < 120 KB **no se cumple**. Detalle reproducible: node scripts/measure-budget.mjs, artifacts/budget.json.

Hero móvil: **47.4 KB AVIF**, 390 × 844 y DPR 1, imagen optimizada de 1280 px; cumple < 250 KB. Se carga un archivo de fuente Archivo variable, 90.1 KB, con preload.

CLS < 0,05: **cumple en las tres páginas**. LCP < 2 s: **pendiente**.

Umbrales Lighthouse (Performance ≥ 95, Accesibilidad ≥ 95, SEO 100, Best Practices ≥ 95): **pendiente en las páginas con Performance < 95 de la tabla**.

Reportes: `artifacts/lighthouse/home.html`, `motos.html`, `motos-800mt-touring.html` y los JSON correspondientes. Los puntajes y tiempos varían con el hardware, la carga del equipo y el servidor; volver a auditar en el hosting final.

<!-- /METRICS -->

## Pendientes para cumplir toda la definición de terminado

- Completar la ficha estrella ZFORCE 1000 Sport con fuentes oficiales del modelo exacto; resolver los demás recursos faltantes del inventario.
- Obtener perfil y colores de alta resolución de 800MT Touring.
- Llevar LCP a menos de 2 s y JavaScript inicial a menos de 120 KB gzip; la tabla de mediciones indica lo alcanzado. La precarga se limita para evitar descargar páginas y formularios durante la primera visita.
- Lighthouse de navegación no mide INP. Se informa TBT por separado; INP < 200 ms queda sin verificar y requiere una prueba de interacción/campo. No se afirma su cumplimiento a partir de TBT.
- Probar Safari real y volver a medir en el despliegue final.
- Next.js 16.3.8 registra `Internal: NoFallbackError` en la consola del servidor al solicitar rutas fuera del catálogo con `dynamicParams = false`. Las pruebas reciben HTTP 404, muestran la página propia y no detectan errores en el navegador. Revisar ese registro del framework antes del despliegue.

Se omitieron deliberadamente checkout, cuentas, CMS, financiación, comparador, blog, analytics, cookies y mapas embebidos, de acuerdo con el alcance solicitado.
