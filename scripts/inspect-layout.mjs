import { chromium } from 'playwright';
import { testHeaders } from './test-headers.mjs';
const browser=await chromium.launch({channel:'chrome',headless:true});
const base = process.env.TEST_URL || 'http://127.0.0.1:3000';
const page=await browser.newPage({extraHTTPHeaders:await testHeaders(base)});
await page.setViewportSize({width:768,height:1000});
await page.goto(base+'/cuatriciclos/cforce-1000',{waitUntil:'networkidle'});
console.log(await page.evaluate(()=>[...document.querySelectorAll('body *')].map(el=>({name:el.tagName,class:el.className,rect:el.getBoundingClientRect().toJSON()})).filter(x=>x.rect.right>innerWidth+1||x.rect.left<0).map(x=>({name:x.name,class:x.class,left:x.rect.left,right:x.rect.right,width:x.rect.width})).slice(0,30)));
for(const width of [390,1280]){
 await page.setViewportSize({width,height:width===390?844:900});
 for(const route of ['/','/motos/800mt-touring','/motos','/cotizar?modelo=800mt-touring']){
  await page.goto(base+route,{waitUntil:'networkidle'});
  await page.screenshot({path:`artifacts/screenshots/viewport-${route==='/'?'home':route.split('?')[0].replaceAll('/','-').slice(1)}-${width}.png`});
 }
}
await browser.close();
