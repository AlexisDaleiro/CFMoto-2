import fs from 'node:fs/promises';
import sharp from 'sharp';
const assets = [
  ['800mt-perfil.png', 'https://cfmotoitaly.it/wp-content/uploads/800mtouring_allineata.png'],
  ['800mt-hero.jpg', 'https://cfmotoitaly.it/wp-content/uploads/DSC2640-scaled.jpg'],
  ['800mt-45.png', 'https://cfmotoitaly.it/wp-content/uploads/800MT-Touring_45-e1643020855216.png'],
  ['800mt-galeria.jpg', 'https://cfmotoitaly.it/wp-content/uploads/DSC2965-scaled.jpg'],
  ['650mt.pdf', 'https://cfmotoitaly.it/wp-content/uploads/650MT-1.pdf'],
  ['700cl-heritage.pdf', 'https://www.cfmoto.com/content/dam/cfmoto/site/global/product/motorcycle/cl-x----classic/700cl-x-heritage/documentation/2020_700CL-X%20HERITAGE%20brochure.pdf'],
  ['150nk.pdf', 'https://www.cfmoto.com/upload/file/manual/2021/CF150-3C_20211228.pdf'],
  ['400gt-650gt.pdf', 'https://www.cfmoto.com/upload/file/manual/2021/CF400-5C_CF650-8_20211228.pdf'],
  ['700cl-heritage.png', 'https://cfmotoitaly.it/wp-content/uploads/700clx.png'],
  ['700cl-sport.png', 'https://cfmotoitaly.it/wp-content/uploads/Sport_laterale_bianca.png'],
  ['650mt.jpg', 'https://cfmotoitaly.it/wp-content/uploads/CFMOTO-650MT_03-scaled.jpg'],
  ['zforce-1000-sport.png', 'https://cfmoto.com.ar/wp-content/uploads/2020/10/zforce1000Sport.png'],
  ['ZFORCE-1000-Sport.jpg', 'https://cfmoto.com.ar/wp-content/uploads/2020/10/ZFORCE-1000-Sport.jpg'],
  ...['51', '40', '38', '17'].map(number => [`MY2021_ZFORCE-1000-Sport_Action-${number}.jpg`, `https://cfmoto.com.ar/wp-content/uploads/2020/10/MY2021_ZFORCE-1000-Sport_Action-${number}.jpg`]),
];
await fs.mkdir('artifacts/sources/assets', { recursive: true });
const previous = await fs.readFile('artifacts/phase2-assets.json', 'utf8').then(JSON.parse).catch(() => ({ records: [] }));
const records = new Map(previous.records.map(record => [record.source, record]));
for (const [name, source] of assets) {
  if (process.argv.includes('--new-only') && !['700cl-heritage.png', '700cl-sport.png', '650mt.jpg', 'zforce-1000-sport.png'].includes(name)) continue;
  if (process.argv.includes('--zforce-only') && !name.toLowerCase().includes('zforce')) continue;
  try {
    const response = await fetch(source, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    const local = `artifacts/sources/assets/${name}`;
    await fs.writeFile(local, bytes);
    const dimensions = name.endsWith('.pdf') ? {} : await sharp(bytes).metadata();
    const record = { local, source, bytes: bytes.length, width: dimensions.width, height: dimensions.height };
    records.set(source, record); console.log(JSON.stringify(record));
  } catch (error) { records.set(source, { source, error: error.message }); console.log(name, error.message); }
}
await fs.writeFile('artifacts/phase2-assets.json', JSON.stringify({ checkedAt: new Date().toISOString(), records: [...records.values()] }, null, 2));
