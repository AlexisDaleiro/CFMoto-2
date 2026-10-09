import fs from 'node:fs/promises';
import { chromium } from 'playwright';

const slugs = ['150nk', '400nk', '400gt', '650nk', '650gt', '650trg', 'cforce-450s', 'cforce-520l', 'cforce-850-xc', 'zforce-550-ex', 'zforce-1000-sport'];
await fs.mkdir('artifacts/sources/uruguay', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage();
const records = [];
try {
  for (const slug of slugs) {
    const source = `https://cfmotouruguay.com/${slug}/`;
    const response = await fetch(source, { signal: AbortSignal.timeout(30000) });
    const html = await response.text();
    await fs.writeFile(`artifacts/sources/uruguay/${slug}.html`, html);
    const data = await page.evaluate(html => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return {
        images: [...doc.images].map(img => ({ src: img.getAttribute('data-src') || img.src, alt: img.alt })),
        tables: [...doc.querySelectorAll('table')].map(table => [...table.rows].map(row => [...row.cells].map(cell => cell.textContent.trim()))),
      };
    }, html);
    records.push({ slug, source, status: response.status, ...data });
    console.log(JSON.stringify({ slug, ...data }));
  }
} finally { await browser.close(); }
await fs.writeFile('artifacts/uruguay-research.json', JSON.stringify({ checkedAt: new Date().toISOString(), records }, null, 2));
