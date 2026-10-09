import fs from 'node:fs/promises';
import sharp from 'sharp';
const research = JSON.parse(await fs.readFile('artifacts/uruguay-research.json', 'utf8'));
const records = [];
await fs.mkdir('artifacts/sources/uruguay-images', { recursive: true });
for (const model of research.records) {
  const source = model.images.find(img => img.src.includes('/uploads/') && !/Logo|garantia/.test(img.src)).src.replace(/^\/\//, 'https://');
  const response = await fetch(source, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`${model.slug}: HTTP ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const raw = `artifacts/sources/uruguay-images/${model.slug}.jpg`;
  await fs.writeFile(raw, bytes);
  const slug = { '650trg': '650tr-g', 'cforce-850-xc': 'cforce-850xc', 'zforce-550-ex': 'zforce-550ex' }[model.slug] || model.slug;
  const line = slug.startsWith('cforce') ? 'cuatriciclos' : slug.startsWith('zforce') ? 'utv' : 'motos';
  const output = `public/images/${line}/${slug}/perfil-oficial.jpg`;
  await fs.mkdir(output.slice(0, output.lastIndexOf('/')), { recursive: true });
  await sharp(bytes).flatten({ background: '#ffffff' }).resize({ width: 2400, withoutEnlargement: true }).jpeg({ quality: 88, mozjpeg: true }).toFile(output);
  const { width, height } = await sharp(output).metadata();
  records.push({ slug, local: output, source, width, height, bytes: (await fs.stat(output)).size, page: model.source });
  console.log(slug, width, height);
}
await fs.writeFile('artifacts/uruguay-images.json', JSON.stringify({ checkedAt: new Date().toISOString(), records }, null, 2));
