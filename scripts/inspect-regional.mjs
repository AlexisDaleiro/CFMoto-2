import fs from 'node:fs/promises';
const pages = ['800-mt-touring', '650-mt', '650-gt', '650-nk', '700-cl-x-heritage', '700-cl-x-sport', '400-nk', '400-gt', 'cforce-450s', 'cforce-520l', 'cforce-850xc', 'zforce-550ex', 'zforce-1000-sport'];
await fs.mkdir('artifacts/sources/regional', { recursive: true });
for (const page of pages) {
  const url = `https://cfmotoitaly.it/${page}/`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    const html = await res.text();
    await fs.writeFile(`artifacts/sources/regional/${page}.html`, html);
    const assets = [...new Set([...html.matchAll(/(?:src|href|data-src)=['"]([^'"]+\.(?:png|jpg|webp|pdf))/gi)].map((m) => m[1]))].filter((s) => !/logo|icon|slider|banner|facebook|instagram|placeholder/i.test(s));
    console.log(JSON.stringify({ page, url, status: res.status, assets: assets.slice(0,18) }));
  } catch (error) { console.log(page, error.message); }
}
