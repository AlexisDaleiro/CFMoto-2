import fs from 'node:fs/promises';
const directory = process.env.TEST_REPORT_DIR || 'artifacts/lighthouse';
const reports = JSON.parse(await fs.readFile(`${directory}/summary.json`, 'utf8'));
const budget = JSON.parse(await fs.readFile(process.env.TEST_BUDGET_FILE || 'artifacts/budget.json', 'utf8'));
const indexable = !reports[0].base.includes('.vercel.app');
const checks = reports.map(report => ({ path: report.path, performance: report.categories.performance >= 95, accessibility: report.categories.accessibility >= 95, bestPractices: report.categories['best-practices'] >= 95, lcp: report.metrics['largest-contentful-paint'] <= 2500, cls: report.metrics['cumulative-layout-shift'] < .05, seo: indexable ? report.categories.seo === 100 : 'noindex verified separately' }));
const jsPass = budget.scriptGzipBytes <= 145187;
const lines = [
 '# Mediciones de laboratorio',
 '',
 `Entorno: ${reports[0].base}. Última ejecución: ${reports.at(-1).fetchTime}. Lighthouse 13, Chrome, 390 × 844, DPR 1, throttling simulado. Mediana independiente de tres ejecuciones por ruta. Todos los HTML y JSON se conservan.`,
 '',
 '| Ruta | Performance | Accesibilidad | Best Practices | SEO | LCP | CLS |',
 '|---|---:|---:|---:|---:|---:|---:|',
 ...reports.map(report => `| ${report.path} | ${report.categories.performance} | ${report.categories.accessibility} | ${report.categories['best-practices']} | ${report.categories.seo} | ${(report.metrics['largest-contentful-paint']/1000).toFixed(2)} s | ${report.metrics['cumulative-layout-shift'].toFixed(4)} |`),
 '',
 `Criterios: Performance/Accesibilidad/Best Practices ≥ 95; LCP ≤ 2,5 s; CLS < 0,05. SEO 100 únicamente en la compilación local indexable. Resultado por criterio: acceptance.json.`,
 '',
 `JS inicial: **${budget.scriptGzipBytes} bytes gzip**, límite 145.187: **${jsPass ? 'cumple' : 'pendiente'}**. Objetivo aspiracional < 120 KB: **${budget.scriptGzipBytes < 120000 ? 'cumple' : 'pendiente'}**.`,
 '',
 'Método idéntico a la referencia: scripts src únicos del HTML inicial, recomprimidos individualmente con gzip de Node; excluye noModule y las precargas de otras rutas. Incluye framework, runtime y aplicación. No equivale a bytes de JavaScript ejecutados ni a toda la transferencia de la página.',
 '',
 'Las mediciones no representan INP de usuarios reales. Event Timing de los recorridos está en artifacts/interactions.json.',
];
await fs.writeFile(`${directory}/METRICS.md`, lines.join('\n') + '\n');
await fs.writeFile(`${directory}/acceptance.json`, JSON.stringify({ checkedAt: new Date().toISOString(), environment: reports[0].base, checks, jsPass, jsBytes: budget.scriptGzipBytes, advisory120KB: budget.scriptGzipBytes < 120000 }, null, 2));
console.log('Reportes y criterios de aceptación actualizados.');
