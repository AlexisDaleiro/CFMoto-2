import fs from 'node:fs/promises';
import sharp from 'sharp';
const source = await fs.readFile('src/content/modelos.ts', 'utf8');
const models = JSON.parse(source.slice(source.indexOf('['), source.lastIndexOf('] satisfies') + 1));
const result = [];
for (const model of models) {
  const photos = [...new Set([model.imagenes.perfil, model.imagenes.hero, model.imagenes.heroMobile, ...(model.imagenes.galeria || []), ...(model.features || []).map(item => item.imagen), ...(model.colores || []).map(item => item.imagen)].filter(Boolean))];
  const images = [];
  for (const path of photos) {
    const { width, height } = await sharp(`public${path}`).metadata();
    images.push({ path, width, height, bytes: (await fs.stat(`public${path}`)).size });
  }
  result.push({ slug: model.slug, name: model.nombre, line: model.linea, origin: model.origen, cc: model.cilindradaCc, sources: model.fuentes, images, keyFigures: model.keySpecs?.length || 0, gallery: model.imagenes.galeria?.length || 0, features: model.features?.length || 0, groups: model.specs?.length || 0, needsYearConfirmation: !model.origen?.anio, needsHighResolution: images.some(image => image.width < 1600) });
}
await fs.writeFile('artifacts/catalogue-content.json', JSON.stringify({ checkedAt: new Date().toISOString(), models: result }, null, 2));
console.log(`${result.length} models; ${result.filter(model => model.needsHighResolution).length} with originals below 1600 px.`);
