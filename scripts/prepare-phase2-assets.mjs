import fs from 'node:fs/promises';
import sharp from 'sharp';
const brochure = 'https://www.cfmoto.com/content/dam/cfmoto/site/global/product/motorcycle/mt----mult-touring/800mt-touring/documentation/2021_800MT%20brochure_International.pdf';
const assets = [
  ['artifacts/sources/assets/800mt-perfil.png', 'public/images/motos/800mt-touring/perfil-oficial.png', 'https://cfmotoitaly.it/wp-content/uploads/800mtouring_allineata.png'],
  ['artifacts/sources/touring-extract/p01-00.png', 'public/images/motos/800mt-touring/hero-oficial.jpg', `${brochure}#page=1`],
  ['artifacts/sources/touring-extract/p07-02.png', 'public/images/motos/800mt-touring/hero-mobile.jpg', `${brochure}#page=7`],
  ['artifacts/sources/assets/700cl-heritage.png', 'public/images/motos/700cl-x-heritage/perfil.png', 'https://cfmotoitaly.it/wp-content/uploads/700clx.png'],
  ['artifacts/sources/assets/700cl-sport.png', 'public/images/motos/700cl-x-sport/perfil.png', 'https://cfmotoitaly.it/wp-content/uploads/Sport_laterale_bianca.png'],
  ['artifacts/sources/assets/650mt.jpg', 'public/images/motos/650mt/hero.jpg', 'https://cfmotoitaly.it/wp-content/uploads/CFMOTO-650MT_03-scaled.jpg'],
  ['artifacts/sources/assets/zforce-1000-sport.png', 'public/images/utv/zforce-1000-sport/perfil.png', 'https://cfmoto.com.ar/wp-content/uploads/2020/10/zforce1000Sport.png'],
  ['artifacts/sources/assets/ZFORCE-1000-Sport.jpg', 'public/images/utv/zforce-1000-sport/hero.jpg', 'https://cfmoto.com.ar/wp-content/uploads/2020/10/ZFORCE-1000-Sport.jpg'],
  ...['51', '40', '38', '17'].map((number, index) => [`artifacts/sources/assets/MY2021_ZFORCE-1000-Sport_Action-${number}.jpg`, `public/images/utv/zforce-1000-sport/galeria-0${index + 1}.jpg`, `https://cfmoto.com.ar/wp-content/uploads/2020/10/MY2021_ZFORCE-1000-Sport_Action-${number}.jpg`]),
];
const records = [];
for (const [input, output, source] of assets) {
  await fs.mkdir(output.slice(0, output.lastIndexOf('/')), { recursive: true });
  const pipeline = sharp(input).rotate().resize({ width: 2400, withoutEnlargement: true });
  await (output.endsWith('.png') ? pipeline.png({ compressionLevel: 9 }) : pipeline.jpeg({ quality: 85, mozjpeg: true })).toFile(output);
  const { width, height } = await sharp(output).metadata();
  records.push({ local: output, source, width, height, bytes: (await fs.stat(output)).size });
}
await fs.writeFile('artifacts/phase2-image-inventory.json', JSON.stringify({ checkedAt: new Date().toISOString(), records }, null, 2));
console.log(records);
