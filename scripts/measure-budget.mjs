import { chromium } from 'playwright';
import { gzipSync } from 'node:zlib';
import fs from 'node:fs/promises';
import { testHeaders } from './test-headers.mjs';

const base = process.env.TEST_URL || 'http://127.0.0.1:3000';
const headers = await testHeaders(base);
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
 const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, extraHTTPHeaders: headers });
 await page.goto(base, { waitUntil: 'networkidle' });
 const html = await (await fetch(base,{headers})).text();
 const urls = [...new Set([...html.matchAll(/<script\b([^>]*?)\bsrc="([^"]+)"[^>]*>/g)].filter(match => !/nomodule|noModule/.test(match[0])).map(match => new URL(match[2], base).href))];
 const scripts = [];
 for (const url of urls) {
  const bytes = Buffer.from(await (await fetch(url,{headers})).arrayBuffer());
  scripts.push({ path: new URL(url).pathname, bytes: bytes.length, gzipBytes: gzipSync(bytes).length });
 }
 const image = await page.locator('.home-hero-photo').evaluate(element => ({ src: element.currentSrc, naturalWidth: element.naturalWidth }));
 const imageBytes = (await (await page.request.get(image.src, { headers: { Accept: 'image/avif,image/webp,image/*' } })).body()).length;
 const resources = await page.evaluate(() => performance.getEntriesByType('resource').filter(entry => entry.name.includes('.woff2')).map(entry => ({ path: new URL(entry.name).pathname, bytes: entry.encodedBodySize })));
 const result = { measuredAt: new Date().toISOString(), viewport: '390 × 844, DPR 1', scriptGzipBytes: scripts.reduce((sum, script) => sum + script.gzipBytes, 0), scripts, hero: { ...image, encodedBytes: imageBytes }, fonts: resources };
 await fs.writeFile(process.env.TEST_BUDGET_FILE || 'artifacts/budget.json', JSON.stringify({...result, environment: base}, null, 2));
 console.log(JSON.stringify(result, null, 2));
} finally { await browser.close(); }
