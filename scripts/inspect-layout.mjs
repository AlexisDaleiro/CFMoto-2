import { chromium } from 'playwright';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage();
await page.setViewportSize({width:768,height:1000});
await page.goto('http://127.0.0.1:3000/cuatriciclos/cforce-1000',{waitUntil:'networkidle'});
console.log(await page.evaluate(()=>[...document.querySelectorAll('body *')].map(el=>({name:el.tagName,class:el.className,rect:el.getBoundingClientRect().toJSON()})).filter(x=>x.rect.right>innerWidth+1||x.rect.left<0).map(x=>({name:x.name,class:x.class,left:x.rect.left,right:x.rect.right,width:x.rect.width})).slice(0,30)));
for(const width of [390,1280]){
 await page.setViewportSize({width,height:width===390?844:900});
 for(const route of ['/','/motos/800mt-touring','/motos','/cotizar?modelo=800mt-touring']){
  await page.goto('http://127.0.0.1:3000'+route,{waitUntil:'networkidle'});
  await page.screenshot({path:`artifacts/screenshots/viewport-${route==='/'?'home':route.split('?')[0].replaceAll('/','-').slice(1)}-${width}.png`});
 }
}
await browser.close();
