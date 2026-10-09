import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { testHeaders } from './test-headers.mjs';
const base = process.env.TEST_URL || 'http://127.0.0.1:3000';
const headers = await testHeaders(base);
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, extraHTTPHeaders: headers });
  await page.addInitScript(() => {
    window.__events = [];
    new PerformanceObserver(list => window.__events.push(...list.getEntries().filter(entry => entry.interactionId).map(entry => ({ name: entry.name, duration: entry.duration, processingMs: entry.processingEnd - entry.processingStart, interactionId: entry.interactionId })))).observe({ type: 'event', buffered: true, durationThreshold: 16 });
  });
  for (const journey of ['featured-quote', 'line-filter-model', 'model-test-ride']) {
    await page.goto(base + (journey === 'model-test-ride' ? '/motos/800mt-touring' : '/'), { waitUntil: 'networkidle' });
    if (journey === 'featured-quote') {
      await page.locator('#featured-models .model-card-link').filter({ hasText: '800MT Touring' }).click();
      await page.waitForURL('**/motos/800mt-touring');
      await page.locator('#product-hero-cta a').click();
      await page.waitForURL('**/cotizar?modelo=800mt-touring');
    } else if (journey === 'line-filter-model') {
      await page.locator('.hero-line-bar a[href="/motos"]').click();
      await page.waitForURL('**/motos');
      await page.getByRole('button', { name: '800 cc', exact: true }).click();
      await page.waitForURL('**/motos?cc=800');
      await page.locator('.catalog-grid .model-card-link').filter({ hasText: '800MT Touring' }).click();
      await page.waitForURL('**/motos/800mt-touring');
    } else {
      await page.locator('.test-ride a[href*="testRide=1"]').click();
      await page.waitForURL('**/cotizar?modelo=800mt-touring&testRide=1');
      await page.waitForFunction(() => document.querySelector('input[name="testRide"]')?.checked);
    }
    await page.waitForTimeout(800);
    const events = await page.evaluate(() => window.__events);
    results.push({ journey, events, maxEventDurationMs: Math.max(0, ...events.map(event => event.duration)), belowObserverThresholdWhenEmpty: !events.length });
  }
  assert.equal(await page.locator('a[href*="wa.me"]').count(), 0);
} finally { await browser.close(); }
await fs.writeFile(process.env.TEST_INTERACTIONS_FILE || 'artifacts/interactions.json', JSON.stringify({ checkedAt: new Date().toISOString(), environment: base, method: 'Chrome Event Timing, threshold 16 ms, mobile viewport 390x844, no CPU/network throttling; laboratory journeys, not field INP', targetMs: 200, results }, null, 2));
console.log(results);
