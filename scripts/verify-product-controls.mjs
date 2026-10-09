import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { testHeaders } from './test-headers.mjs';
const base = process.env.TEST_URL || 'http://127.0.0.1:3000';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 }, extraHTTPHeaders: await testHeaders(base), reducedMotion: 'reduce' });
  for (const path of ['/motos/800mt-touring', '/cuatriciclos/cforce-1000', '/utv/zforce-1000-sport']) {
    await page.goto(base + path, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.key-specs > div').count(), 4);
    assert.ok(await page.locator('#product-gallery figure').count() >= 4);
    assert.equal(await page.locator('.feature').count(), 3);
    const gallery = page.locator('#product-gallery');
    await page.getByRole('button', { name: 'Siguiente en galería', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('#product-gallery').scrollLeft > 0);
    await page.getByRole('button', { name: 'Anterior en galería', exact: true }).click();
    await page.waitForFunction(() => {
      const el = document.querySelector('#product-gallery');
      return el.scrollLeft <= parseFloat(getComputedStyle(el).paddingInlineStart) + 1;
    });
    assert.ok(await gallery.evaluate(el => el.scrollLeft <= parseFloat(getComputedStyle(el).paddingInlineStart) + 1));
    const accordion = page.locator('.spec-group').first();
    await accordion.locator('summary').focus();
    await page.keyboard.press('Enter');
    assert.equal(await accordion.evaluate(el => el.open), true);
    await page.keyboard.press('Enter');
    assert.equal(await accordion.evaluate(el => el.open), false);
    results.push({ path, fourFigures: true, fourOrMorePhotos: true, threeEquipmentBlocks: true, galleryControls: 'pass', keyboardAccordion: 'pass', reducedMotion: true });
  }
} finally { await browser.close(); }
await fs.writeFile(process.env.TEST_PRODUCT_FILE || 'artifacts/product-controls.json', JSON.stringify({ checkedAt: new Date().toISOString(), environment: base, results }, null, 2));
console.log('PASS: flagship gallery controls and keyboard accordions.');
