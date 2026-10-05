import fs from 'node:fs/promises';
const base = 'https://www.cfmoto.com';
const groups = JSON.parse((await fs.readFile('.cfmoto-products.json','utf8')).replace(/^\uFEFF/,''));
const products = groups.flatMap(g => g.categories.flatMap(c => c.products));
const names = ['150NK','250NK','300SR','300NK','400NK','400GT','450SR','650MT','650NK','650GT','650TR-G','700CL-X Heritage','700CL-X Sport','800MT Touring','800MT Sport','CFORCE 450S','CFORCE 520L','CFORCE 625','CFORCE 625 Touring','CFORCE 850XC','CFORCE 1000','CFORCE 1000 Overland','ZFORCE 550EX','UFORCE 600','UFORCE 1000','UFORCE 1000 XL','ZFORCE 1000 Sport'];
const slug = s => s.toLowerCase().replaceAll(' ','-');
const decode = s => s.replaceAll('&#34;','"').replaceAll('&quot;','"').replaceAll('&amp;','&').replaceAll('&#39;',"'").replaceAll('&lt;','<').replaceAll('&gt;','>');
await fs.mkdir('artifacts/sources',{recursive:true});
async function getPage(name) {
 const found=products.find(p=>p.title.trim().toLowerCase()===name.toLowerCase());
 let path=found?.pageLink;
 if(!path){
  const n=name.toLowerCase();
  if(n.startsWith('cforce')) path='/content/cfmoto/global/atv/atv/'+n.replaceAll(' ','_').replace('450s','450_s').replace('520l','520_l').replace('850xc','850_xc')+'.html';
  else if(n.startsWith('zforce')) path='/content/cfmoto/global/sxs/sports/'+n.replaceAll(' ','_')+'.html';
  else { const cat=n.includes('nk')?'naked':n.includes('gt')||n.includes('tr-g')?'grand-touring':n.includes('cl-x')?'classic':'mult-touring'; path='/content/cfmoto/global/motorcycles/'+cat+'/'+n.replaceAll(' ','_')+'.html'; }
 }
 const url=base+path;
 try {
  const res=await fetch(url,{signal:AbortSignal.timeout(25000)});
  if(!res.ok)throw Error('HTTP '+res.status);
  const html=await res.text();
  const main=html.slice(html.indexOf('</headercomponent>')+18,html.indexOf('<footercomponent'));
  const attrs=[...main.matchAll(/(\w+)="([^"\n]*)"/g)].filter(x=>x[2].includes('&#34;')).map(x=>{try{return {key:x[1],data:JSON.parse(decode(x[2]))};}catch{return null;}}).filter(Boolean);
  const record={name,url,icon:found?.image,attrs};
  await fs.writeFile('artifacts/sources/'+slug(name)+'.json',JSON.stringify(record,null,2));
  console.log(name,attrs.length?'OK '+attrs.length:'EMPTY');
 }catch(e){console.log(name,'MISSING',e.message);}
}
for(let i=0;i<names.length;i+=4)await Promise.all(names.slice(i,i+4).map(getPage));
