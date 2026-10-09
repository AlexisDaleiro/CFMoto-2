import fs from 'node:fs/promises';

const root = 'https://www.cfmoto.com';
const candidates = {
  '150nk': ['motorcycles/naked/150nk'],
  '400nk': ['motorcycles/naked/400nk'],
  '400gt': ['motorcycles/grand-touring/400gt'],
  '650mt': ['motorcycles/mult-touring/650mt'],
  '650nk': ['motorcycles/naked/650nk'],
  '650gt': ['motorcycles/grand-touring/650gt'],
  '650tr-g': ['motorcycles/grand-touring/650tr-g', 'motorcycles/grand-touring/650tr_g'],
  '700cl-x-heritage': ['motorcycles/classic/700cl-x_heritage', 'motorcycles/classic/700cl-x-heritage'],
  '700cl-x-sport': ['motorcycles/classic/700cl-x_sport', 'motorcycles/classic/700cl-x-sport'],
  '800mt-touring': ['motorcycles/mult-touring/800mt_touring'],
  'cforce-450s': ['atv/atv/cforce_450_s', 'atv/atv/cforce_450s'],
  'cforce-520l': ['atv/atv/cforce_520_l', 'atv/atv/cforce_520l'],
  'cforce-850xc': ['atv/atv/cforce_850_xc', 'atv/atv/cforce_850xc'],
  'zforce-550ex': ['sxs/sports/zforce_550_ex', 'sxs/sports/zforce_550ex'],
  'zforce-1000-sport': ['sxs/sports/zforce_1000_sport', 'sxs/sports/zforce-1000-sport'],
};
const decode = (s) => s.replaceAll('&#34;', '"').replaceAll('&quot;', '"').replaceAll('&amp;', '&').replaceAll('&#39;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>');
await fs.mkdir('artifacts/sources/phase2', { recursive: true });
const results = [];
for (const [slug, paths] of Object.entries(candidates)) {
  for (const path of paths) {
    const url = `${root}/content/cfmoto/global/${path}.html`;
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
      const html = await response.text();
      const main = html.slice(html.indexOf('</headercomponent>') + 18, html.indexOf('<footercomponent'));
      const attrs = [...main.matchAll(/(\w+)="([^"\n]*)"/g)].filter((x) => x[2].includes('&#34;')).flatMap((x) => { try { return [{ key: x[1], data: JSON.parse(decode(x[2])) }]; } catch { return []; } });
      const technical = attrs.some((a) => a.key === 'specification' && a.data.length > 0);
      const record = { slug, url, status: response.status, technical, attrs };
      await fs.writeFile(`artifacts/sources/phase2/${slug}-${paths.indexOf(path)}.json`, JSON.stringify(record, null, 2));
      results.push({ slug, url, status: response.status, technical });
      console.log(slug, technical ? 'technical data found' : 'no technical data');
      if (technical) break;
    } catch (error) { results.push({ slug, url, error: error.message }); console.log(slug, error.message); }
  }
}
await fs.writeFile('artifacts/phase2-research.json', JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2));
