# CFMOTO Uruguay: demo comercial

Next.js 16.3.8, React, TypeScript y Tailwind CSS 4. Conserva 27 modelos, 32 paginas publicas y generacion estatica. Cotizacion y WhatsApp son simulaciones sin persistencia. La fase 2 tiene criterios pendientes; ver ENTREGA-FASE-2.md.

## Ejecutar

Node.js >= 20.9 y npm; probado con Node 24.19. Chrome instalado para las pruebas.

```sh
npm ci
npm run dev
```

Abrir [demo local](http://localhost:3000). Para produccion local:

```powershell
$env:SITE_INDEXABLE='true'
$env:NEXT_PUBLIC_SITE_URL='http://localhost:3001'
npm run build
npm run start -- --port 3001
```

Archivo se sirve localmente con licencia OFL; la compilacion no necesita Google Fonts. No usar output: export: las paginas son estaticas, pero la validacion utiliza una server action y las imagenes el optimizador de Next.

## Verificacion Reproducible

En otra terminal, con el servidor iniciado:

```powershell
$env:TEST_URL='http://127.0.0.1:3001'
npm run lint
npm run typecheck
npm run verify
node scripts/verify-browsers.mjs
node scripts/verify-interactions.mjs
node scripts/verify-product-controls.mjs
node scripts/diagnose-404.mjs
node scripts/measure-budget.mjs
npm run audit:mobile
node scripts/report-metrics.mjs
```

Lighthouse ejecuta ocho rutas, tres veces cada una, con la misma configuracion movil. No ejecutar otras pruebas de navegador o compilaciones simultaneamente. Guarda cada HTML/JSON, medianas y criterios individuales. verify comprueba cinco anchos, 32 rutas, recursos, DPR 1/2, filtros e historial, formulario y dialogo de WhatsApp. Las capturas no certifican la nitidez de originales insuficientes.

```sh
npx playwright install firefox webkit
```

WebKit no reemplaza Safari real en iPhone. Las interacciones son Event Timing de laboratorio sin throttling, no INP de campo. TEST_URL unifica los scripts para local y preview. TEST_REPORT_DIR permite conservar auditorias separadas; TEST_BUDGET_FILE, TEST_VERIFICATION_FILE, TEST_BROWSER_FILE, TEST_INTERACTIONS_FILE, TEST_PRODUCT_FILE y TEST_404_FILE separan sus otras evidencias.

## Preview de Vercel

Proyecto existente: [cfmoto-2](https://vercel.com/alexis20/cfmoto-2). La URL fijada esta en ENTREGA-FASE-2.md. Produccion y despliegues anteriores permanecen intactos.

```sh
npx vercel deploy --yes --scope alexis20 --build-env SITE_INDEXABLE=false
```

No usar --prod. Preview utiliza VERCEL_URL como base si NEXT_PUBLIC_SITE_URL no esta definido: canonical, Open Graph y sitemap apuntan a esa URL. SITE_INDEXABLE=false genera noindex, nofollow tanto en metadata como en X-Robots-Tag; robots permite rastrear para leer la exclusion. No enviar el sitemap a buscadores.

La proteccion de Vercel se conserva. Para verificarla con una sesion autorizada:

```powershell
$env:TEST_URL='https://URL-DEL-PREVIEW.vercel.app'
npx vercel curl / --deployment $env:TEST_URL --scope alexis20 -- --location --cookie-jar artifacts/sources/vercel-cookies.txt --header x-vercel-set-bypass-cookie:true --silent --output artifacts/sources/preview-home.html
node scripts/verify-preview.mjs
$env:TEST_REPORT_DIR='artifacts/lighthouse-preview'
$env:TEST_BUDGET_FILE='artifacts/budget-preview.json'
node scripts/measure-budget.mjs
npm run audit:mobile
node scripts/report-metrics.mjs
```

La cookie de prueba queda en una carpeta ignorada y se filtra por hostname. No compartirla ni incorporarla al repositorio. Para presentar al cliente usar una sesion autorizada o un enlace compartido de Vercel, sin desactivar la proteccion.

## Contenido y Arquitectura

- src/content/modelos.ts: catalogo tipado, precios ilustrativos, fuentes, origen de version/mercado/ano y pies de galeria.
- src/lib/catalogo.ts: adaptador unico. segmentoCc agrupa comercialmente; cilindradaCc es el valor documentado.
- src/components/model-image.tsx: getImageProps en servidor, imagenes responsivas y art direction del hero.
- src/components/whatsapp-demo.tsx: dialogo cargado al abrir, mensajes sin datos personales; ningun CTA abre WhatsApp real.
- src/lib/whatsapp.ts: generacion de mensaje independiente del constructor de enlace externo, no utilizado por la demo.
- src/app/cotizar/actions.ts: validacion del servidor sin registrar ni persistir consultas.
- src/lib/environment.ts: politica de indexacion de demo; precios ficticios no generan Offer en JSON-LD.

Inventario: CATALOGO.md e IMAGES.md. Materiales pendientes: SOLICITUD-MATERIALES.md. Guion: PRESENTACION.md. Evidencia: artifacts/, incluida la referencia anterior en artifacts/phase1/. Los originales descargados y credenciales se excluyen de Git y del despliegue.

## Referencias

[Checklist Next.js](https://nextjs.org/docs/app/guides/production-checklist), [imagenes](https://nextjs.org/docs/app/api-reference/components/image), [fuentes](https://nextjs.org/docs/app/api-reference/components/font), [ViewTransition](https://react.dev/reference/react/ViewTransition), [Web Vitals](https://web.dev/articles/vitals), [entornos Vercel](https://vercel.com/docs/deployments/environments).
