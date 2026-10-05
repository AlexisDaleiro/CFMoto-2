import fs from 'node:fs/promises';
import sharp from 'sharp';
const root='/content/dam/cfmoto/site/global/product/';
const candidates=[
 ...['800MT-Twilight Blue.png','Twilight Blue.png','Twilight-Blue.png','model1.png','model2.png','800MT Touring.png','800MT touring.png'].flatMap(n=>['product-image/','color/','model/',''].map(d=>root+'motorcycle/mt----mult-touring/800mt-touring/'+d+n)),
 ...['zforce-1000-sport','zforce-1000'].flatMap(d=>['icon.png','product-image/Orange.png','product-image/ZFORCE1000.png','gallery-small-pictures/ZFORCE1000-banner.png','documentation/2020_ZFORCE 1000 SPORT brochure.pdf','documentation/2019_ZFORCE1000 SPORT brochure.pdf'].map(n=>root+'sxs/sports/'+d+'/'+n))
];
const found=[];
for(let i=0;i<candidates.length;i+=6) await Promise.all(candidates.slice(i,i+6).map(async path=>{try{const r=await fetch('https://www.cfmoto.com'+path,{signal:AbortSignal.timeout(15000)});if(!r.headers.get('content-type')?.match(/image|pdf/))return;const b=Buffer.from(await r.arrayBuffer());const info=path.endsWith('.pdf')?{}:await sharp(b).metadata();const file='artifacts/sources/found-'+found.length+(path.endsWith('.pdf')?'.pdf':'.png');await fs.writeFile(file,b);found.push({path,file,info:{width:info.width,height:info.height}});console.log(path,info.width,info.height)}catch{}}));
await fs.writeFile('artifacts/sources/found-images.json',JSON.stringify(found,null,2));
