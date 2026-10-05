import lighthouse from 'lighthouse';
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
const chrome = await chromium.launch({channel:'chrome',headless:true,args:['--remote-debugging-port=9222']});
const summary=[];
try {
 await fs.mkdir('artifacts/lighthouse',{recursive:true});
 for (const path of ['/', '/motos', '/motos/800mt-touring']) {
  const result=await lighthouse('http://127.0.0.1:3000'+path,{port:9222,output:['json','html'],onlyCategories:['performance','accessibility','best-practices','seo'],formFactor:'mobile',screenEmulation:{mobile:true,width:390,height:844,deviceScaleFactor:1,disabled:false}});
  const name=path==='/'?'home':path.replaceAll('/','-').slice(1);
  await fs.writeFile(`artifacts/lighthouse/${name}.json`,result.report[0]);
  await fs.writeFile(`artifacts/lighthouse/${name}.html`,result.report[1]);
  const lhr=result.lhr;
  const item={path,fetchTime:lhr.fetchTime,categories:Object.fromEntries(Object.entries(lhr.categories).map(([key,cat])=>[key,Math.round(cat.score*100)])),metrics:Object.fromEntries(['first-contentful-paint','largest-contentful-paint','cumulative-layout-shift','total-blocking-time','speed-index','total-byte-weight'].map(k=>[k,lhr.audits[k]?.numericValue])),failed:Object.values(lhr.audits).filter(a=>a.score!==null&&a.score<.9).map(a=>({id:a.id,score:a.score,displayValue:a.displayValue,details:a.details}))};
  summary.push(item);console.log(JSON.stringify({...item,failed:item.failed.map(a=>a.id)}));
 }
 await fs.writeFile('artifacts/lighthouse/summary.json',JSON.stringify(summary,null,2));
}finally{await chrome.close();}
