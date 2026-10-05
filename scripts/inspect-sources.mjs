import fs from 'node:fs/promises';
for (const file of ['download-center.html', 'china-home.html']) {
  let h = await fs.readFile('artifacts/sources/' + file, 'utf8');
  h = h.replaceAll('&#34;', '"').replaceAll('&amp;', '&');
  console.log(file, h.length);
  console.log((h.match(/.{0,60}(?:downloadcentercomponent|downloadCenter|\.json|\.svg).{0,160}/gi) ?? []).slice(0,25).join('\n'));
}
