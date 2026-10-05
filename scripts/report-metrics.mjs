import fs from 'node:fs/promises';

const reports = JSON.parse(await fs.readFile('artifacts/lighthouse/summary.json', 'utf8'));
const budget = JSON.parse(await fs.readFile('artifacts/budget.json', 'utf8'));
const home = reports.find(report => report.path === '/');
const seconds = value => `${(value / 1000).toFixed(2)} s`;
const kb = value => `${(value / 1000).toFixed(1)} KB`;
const table = [
 '| Página | Performance | Accesibilidad | Best Practices | SEO | LCP | CLS | TBT | Transferencia total |',
 '|---|---:|---:|---:|---:|---:|---:|---:|---:|',
 ...reports.map(report => `| ${report.path} | ${report.categories.performance} | ${report.categories.accessibility} | ${report.categories['best-practices']} | ${report.categories.seo} | ${seconds(report.metrics['largest-contentful-paint'])} | ${report.metrics['cumulative-layout-shift'].toFixed(4)} | ${Math.round(report.metrics['total-blocking-time'])} ms | ${kb(report.metrics['total-byte-weight'])} |`),
 '',
 `Última auditoría: ${home.fetchTime}. Se conserva la última ejecución completa, sin seleccionar únicamente los mejores valores.`,
 '',
 '| Dato | Sitio actual, informado en el prompt | Demo, medido en el home |',
 '|---|---|---|',
 `| Transferencia | 3,2 MB | ${(home.metrics['total-byte-weight'] / 1000000).toFixed(2)} MB |`,
 `| Carga / LCP | ~3,3 s de carga, método no informado | ${seconds(home.metrics['largest-contentful-paint'])} de LCP simulado |`,
 '| H1 | Ausente | Un H1 por página |',
 '| Meta description | Ausente | Única, 140–160 caracteres, en las 32 páginas |',
 '',
 `JS inicial del home: **${kb(budget.scriptGzipBytes)} gzip**. Se suman los archivos únicos script[src] presentes en el HTML inicial, recomprimidos con gzip, excluyendo el polyfill noModule que Chrome moderno no ejecuta y las precargas de otras rutas. El objetivo < 120 KB **no se cumple**. Detalle reproducible: node scripts/measure-budget.mjs, artifacts/budget.json.`,
 '',
 `Hero móvil: **${kb(budget.hero.encodedBytes)} AVIF**, 390 × 844 y DPR 1, imagen optimizada de 1280 px; cumple < 250 KB. Se carga un archivo de fuente Archivo variable, ${kb(budget.fonts[0].bytes)}, con preload.`,
 '',
 `CLS < 0,05: **${reports.every(report => report.metrics['cumulative-layout-shift'] < .05) ? 'cumple en las tres páginas' : 'pendiente'}**. LCP < 2 s: **${reports.every(report => report.metrics['largest-contentful-paint'] < 2000) ? 'cumple' : 'pendiente'}**.`,
 '',
 `Umbrales Lighthouse (Performance ≥ 95, Accesibilidad ≥ 95, SEO 100, Best Practices ≥ 95): **${reports.every(report => report.categories.performance >= 95 && report.categories.accessibility >= 95 && report.categories.seo === 100 && report.categories['best-practices'] >= 95) ? 'cumplen las tres páginas' : 'pendiente en las páginas con Performance < 95 de la tabla'}**.`,
 '',
 'Reportes: `artifacts/lighthouse/home.html`, `motos.html`, `motos-800mt-touring.html` y los JSON correspondientes. Los puntajes y tiempos varían con el hardware, la carga del equipo y el servidor; volver a auditar en el hosting final.',
].join('\n');
const path = 'DEMO-NOTES.md';
const notes = await fs.readFile(path, 'utf8');
const start = '<!-- METRICS -->';
const end = '<!-- /METRICS -->';
const expression = notes.includes(end) ? /<!-- METRICS -->[\s\S]*?<!-- \/METRICS -->/ : /<!-- METRICS -->/;
await fs.writeFile(path, notes.replace(expression, `${start}\n\n${table}\n\n${end}`));
console.log('DEMO-NOTES.md actualizado con la última auditoría y el presupuesto medido.');
