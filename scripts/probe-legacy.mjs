import fs from 'node:fs/promises';
const base='https://www.cfmoto.com';
const urls=[
'/content/cfmoto/global/sxs/sports/zforce_1000.html',
'/content/cfmoto/global/sxs/sports/zforce_1000sport.html',
'/content/cfmoto/global/motorcycles/mult-touring/800mt.html',
'/content/cfmoto/global/motorcycles/mult-touring/800mt_touring1.html',
'/content/dam/cfmoto/site/global/product/sxs/sports/zforce-1000-sport/documentation/2021_ZFORCE%201000%20SPORT%20brochure.pdf',
'/content/dam/cfmoto/site/global/product/motorcycle/mt----mult-touring/800mt-touring/selling-point-chart&studio-pictures/banner_800MT%20touring.png',
'/content/dam/cfmoto/site/global/product/motorcycle/mt----mult-touring/800mt-touring/product-image/Nebula%20Black.png',
'/etc/designs/cfmoto/assets/common/logo.svg',
];
await Promise.all(urls.map(async (path,i)=>{try{const res=await fetch(base+path,{signal:AbortSignal.timeout(15000)});const b=Buffer.from(await res.arrayBuffer());await fs.writeFile('artifacts/sources/probe-'+i+(path.endsWith('.pdf')?'.pdf':path.endsWith('.png')?'.png':path.endsWith('.svg')?'.svg':'.html'),b);console.log(i,res.status,b.length,b.toString().includes('<title>404</title>')?'404PAGE':'',path);}catch(e){console.log(i,e.message)}}));
