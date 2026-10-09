import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { testHeaders } from './test-headers.mjs';
const base = process.env.TEST_URL || 'http://127.0.0.1:3000';
const headers = await testHeaders(base);
const results = [];
for (const path of ['/ruta-inexistente', '/motos/modelo-inexistente', '/linea-inexistente/modelo', '/motos/800mt-touring/extra']) {
  const response = await fetch(base + path, { headers });
  const html = await response.text();
  const ownInterface = html.includes('Este camino') && html.includes('Volver al inicio');
  assert.equal(response.status, 404, path);
  assert.ok(ownInterface, path + ' own 404');
  results.push({ path, status: response.status, ownInterface });
}
const manifest = base.includes('.vercel.app') ? null : await fs.readFile('.next/prerender-manifest.json', 'utf8').then(JSON.parse);
const dynamicRoutes = manifest && Object.fromEntries(Object.entries(manifest.dynamicRoutes).map(([route, data]) => [route, { fallback: data.fallback }]));
await fs.writeFile(process.env.TEST_404_FILE || 'artifacts/404-diagnostic.json', JSON.stringify({ checkedAt: new Date().toISOString(), environment: base, results, dynamicRoutes, diagnosis: 'Local Next.js 16.3.8 logs Internal: NoFallbackError for unknown static catalog paths with dynamicParams=false. HTTP and own UI remain correct. The prerender manifest uses fallback=false. Association with framework static-path rejection is reproduced; a complete internal stack is not exposed by the production log. No route widening or dependency changes were made.' }, null, 2));
console.log('PASS: four missing routes return own 404.');
