# CFMOTO Uruguay — demo navegable

Next.js 16.3.8 (App Router), React 19.3, TypeScript estricto, Tailwind CSS 4 y Archivo variable. Sin bibliotecas de UI, animación, iconos ni scripts externos.

## Ejecutar

Requiere Node.js 20.9 o posterior y npm. Probado con Node 24.19.

```sh
npm ci
npm run dev
```

Abrir http://localhost:3000. Para comprobar el resultado de producción:

```sh
npm run build
npm run start
```

La primera compilación necesita acceso a Google Fonts. La fuente queda alojada localmente por `next/font/google`; los visitantes no hacen pedidos a Google.

## Verificar

```sh
npm run lint
npm run typecheck
```

Con `npm run start` abierto en otra terminal y Chrome instalado:

```sh
npm run verify
npm run audit:mobile
node scripts/measure-budget.mjs
node scripts/report-metrics.mjs
```

`verify` recorre las 32 páginas del sitemap, comprueba 45 combinaciones de página/ancho (360, 390, 768, 1280, 1920), imágenes, H1, 404, filtros, historial, menú, colores, barra móvil y formulario. Guarda evidencia en `artifacts/`.

Para verificar motores adicionales:

```sh
npx playwright install firefox webkit
node scripts/verify-browsers.mjs
```

WebKit permite comprobar el motor usado por Safari; no reemplaza una prueba en Safari sobre macOS o iOS. Los reportes de Lighthouse en HTML/JSON están en `artifacts/lighthouse/`. El envío del formulario es simulado y no persiste datos.

La demo todavía no cumple toda la definición de terminado: faltan recursos oficiales de varios modelos y los presupuestos de LCP y JavaScript; la última medición está en `DEMO-NOTES.md`.

## Desplegar en Vercel

1. Subir este repositorio a GitHub e importarlo en Vercel.
2. Seleccionar el preset Next.js, instalar con `npm ci` y compilar con `npm run build`.
3. Configurar `NEXT_PUBLIC_SITE_URL` con el dominio de la demo. Se usa en canonical, Open Graph, JSON-LD y sitemap; requiere recompilar si cambia.
4. Desplegar y volver a medir en el dominio real. No se necesita base de datos, API key ni servicio de email.

No usar `output: "export"`: las páginas se generan estáticas, pero el formulario usa una server action y las imágenes el optimizador de Next. Vercel soporta ambos. Esta entrega no realiza ningún despliegue.

## Contenido y arquitectura

- `src/content/modelos.ts`: 27 modelos, 15 motos, 7 cuatriciclos y 5 UTV. Slugs estables, precios exclusivamente ilustrativos y fuentes por modelo.
- `src/content/types.ts`: contrato tipado; `segmentoCc` conserva la agrupación comercial del prompt. La cilindrada real se muestra únicamente cuando está verificada.
- `src/lib/catalogo.ts`: único acceso a datos. Reemplazar este adaptador para integrar un backend futuro.
- `src/content/sitio.ts`: contacto, horarios, 19 departamentos y 10 talleres.
- `src/app/cotizar/actions.ts`: validación de servidor y punto de conexión para CRM/email.
- `public/images/`: recursos oficiales locales, sin hotlinking.

Ver `IMAGES.md` para origen de archivos y `DEMO-NOTES.md` para simulaciones, mediciones y pendientes. Las herramientas de investigación y extracción de `scripts/` no se ejecutan durante la compilación ni el despliegue; las fuentes descargadas quedan ignoradas en Git.

## APIs verificadas

Se verificaron las APIs contra la documentación oficial de Next.js 16.3.8 antes de usarlas: params asíncronos, `generateStaticParams`, `dynamicParams = false`, metadata, server actions, `next/image`, `next/font` y la integración de `ViewTransition` de React. App Router activa las transiciones de navegación sin una librería adicional. Se desactivan animaciones con `prefers-reduced-motion`, y se conserva navegación normal cuando falta la API del navegador.

- https://nextjs.org/docs/app/guides/view-transitions
- https://nextjs.org/docs/app/api-reference/functions/generate-static-params
- https://nextjs.org/docs/app/api-reference/components/image
- https://nextjs.org/docs/app/api-reference/components/font
- https://react.dev/reference/react/ViewTransition
