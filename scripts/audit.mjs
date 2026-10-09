import lighthouse from 'lighthouse';
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import { testHeaders } from './test-headers.mjs';
const base = process.env.TEST_URL || 'http://127.0.0.1:3000';
const port = Number(process.env.LH_PORT || 9223);
const summary = [];
const headers = await testHeaders(base);
const directory = process.env.TEST_REPORT_DIR || 'artifacts/lighthouse';
const paths = ['/', '/motos', '/cuatriciclos', '/utv', '/motos/800mt-touring', '/cuatriciclos/cforce-1000', '/utv/zforce-1000-sport', '/cotizar'];
const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
await fs.mkdir(directory, { recursive: true });
  for (const path of paths) {
    const runs = [];
    const name = path === '/' ? 'home' : path.replaceAll('/', '-').slice(1);
    for (let run = 1; run <= 3; run++) {
      // A fresh process also isolates Vercel authentication from Lighthouse storage resets.
      const chrome = await chromium.launch({ channel: 'chrome', headless: true, args: [`--remote-debugging-port=${port}`] });
      try {
      const result = await lighthouse(base + path, { port, extraHeaders: headers, output: ['json', 'html'], onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'], formFactor: 'mobile', screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 1, disabled: false } });
      const redact = text => headers.Cookie ? text.replaceAll(headers.Cookie, '[redacted]') : text;
      await fs.writeFile(`${directory}/${name}-run-${run}.json`, redact(result.report[0]));
      await fs.writeFile(`${directory}/${name}-run-${run}.html`, redact(result.report[1]));
      const lhr = result.lhr;
      const final = new URL(lhr.finalDisplayedUrl);
      if (final.origin !== new URL(base).origin || final.pathname.replace(/\/$/, '') !== path.replace(/\/$/, '')) throw new Error(`Invalid audit target for ${path}: authentication or redirect. Reports retained; no median accepted.`);
      runs.push({ fetchTime: lhr.fetchTime, categories: Object.fromEntries(Object.entries(lhr.categories).map(([key, cat]) => [key, Math.round(cat.score * 100)])), metrics: Object.fromEntries(['first-contentful-paint', 'largest-contentful-paint', 'cumulative-layout-shift', 'total-blocking-time', 'speed-index', 'total-byte-weight'].map((k) => [k, lhr.audits[k]?.numericValue])), failed: Object.values(lhr.audits).filter((a) => a.score !== null && a.score < .9).map((a) => ({ id: a.id, score: a.score, displayValue: a.displayValue })) });
      console.log(path, `run ${run}`, runs.at(-1).categories.performance, Math.round(runs.at(-1).metrics['largest-contentful-paint']));
      } finally { await chrome.close(); }
    }
    summary.push({ path, base, fetchTime: runs.at(-1).fetchTime, method: 'median of 3 runs per metric; all runs retained', categories: Object.fromEntries(Object.keys(runs[0].categories).map((k) => [k, median(runs.map((r) => r.categories[k]))])), metrics: Object.fromEntries(Object.keys(runs[0].metrics).map((k) => [k, median(runs.map((r) => r.metrics[k]))])), runs });
    await fs.writeFile(`${directory}/summary.json`, JSON.stringify(summary, null, 2));
  }
