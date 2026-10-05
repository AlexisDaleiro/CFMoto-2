import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const base = process.env.TEST_URL || 'http://127.0.0.1:3000';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
await fs.mkdir('artifacts/screenshots', { recursive: true });
const errors = [];
const results = [];
try {
 const page = await browser.newPage();
 page.on('pageerror', e => errors.push(e.message));
 const routes=['/', '/motos', '/cuatriciclos', '/utv', '/motos/800mt-touring', '/cuatriciclos/cforce-1000', '/utv/zforce-1000-sport', '/cotizar?modelo=800mt-touring', '/ruta-inexistente'];
 for (const width of [360,390,768,1280,1920]) {
  await page.setViewportSize({width,height:width<768?844:1000});
  for(const route of routes) {
   const response=await page.goto(base+route,{waitUntil:'networkidle'});
   await page.evaluate(()=>document.fonts.ready);
   const dimensions=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src)}));
   assert.equal(dimensions.h1,1,`One H1 ${route}`);
   assert.ok(dimensions.scroll<=width,`Horizontal overflow ${route} @${width}: ${dimensions.scroll}`);
   assert.equal(dimensions.broken.length,0,`Broken images ${route}`);
   assert.equal(response.status(),route==='/ruta-inexistente'?404:200,`HTTP ${route}`);
   results.push({route,width,...dimensions});
   if([390,1280].includes(width)&&['/','/motos','/motos/800mt-touring','/cuatriciclos/cforce-1000','/cotizar?modelo=800mt-touring'].includes(route)) {
    for(let y=0;y<await page.evaluate(()=>document.documentElement.scrollHeight);y+=700){await page.evaluate(y=>window.scrollTo(0,y),y);await page.waitForTimeout(80);}
    await page.waitForLoadState('networkidle');
    await page.evaluate(()=>window.scrollTo(0,0));
    await page.waitForTimeout(350);
    await page.screenshot({path:`artifacts/screenshots/${route==='/'?'home':route.split('?')[0].replaceAll('/','-').slice(1)}-${width}.png`,fullPage:true});
   }
  }
 }
 await page.setViewportSize({width:390,height:844});
 await page.goto(base);
 assert.ok((await page.locator('.hero-line-bar').boundingBox()).y+102<=844,'Line bar visible without scrolling');
 await page.getByRole('button',{name:'Abrir menú'}).click();
 assert.equal(await page.locator('dialog').evaluate(el=>el.open),true,'Menu opens');
 await page.keyboard.press('Escape');
 assert.equal(await page.locator('dialog').evaluate(el=>el.open),false,'Escape closes');
 await page.goto(base+'/motos?cc=650');
 assert.equal(await page.locator('.catalog-cell').count(),4,'Direct URL filters');
 await page.getByRole('button',{name:'800 cc',exact:true}).click();
 await page.waitForURL('**/motos?cc=800');
 assert.equal(await page.locator('.catalog-cell').count(),2,'Filter changes without reload');
 await page.goBack();
 assert.equal(await page.locator('.catalog-cell').count(),4,'Back restores filter');
 await page.goto(base+'/motos/800mt-touring');
 await page.locator('#product-hero-cta').scrollIntoViewIfNeeded();
 await page.locator('#ficha-tecnica').scrollIntoViewIfNeeded();
 await page.waitForFunction(()=>document.documentElement.classList.contains('show-product-bar'));
 await page.locator('.product-mobile-bar').waitFor({state:'visible'});
 assert.equal(await page.locator('.product-mobile-bar').isVisible(),true,'Mobile CTA appears');
 await page.goto(base+'/cuatriciclos/cforce-1000');
 const radios=page.locator('input[name="color"]');
 if(await radios.count()>1){await radios.nth(1).check();assert.equal(await radios.nth(1).isChecked(),true,'Color changes');}
 await page.goto(base+'/cotizar?modelo=800mt-touring&testRide=1');
 assert.equal(await page.locator('#modelo').inputValue(),'800mt-touring','Quote model prefilled');
 assert.equal(await page.locator('input[name="testRide"]').isChecked(),true,'Test ride prefilled');
 await page.locator('#nombre').fill('Prueba local');
 await page.locator('#telefono').fill('123');
 await page.locator('#telefono').blur();
 assert.equal(await page.locator('#telefono').evaluate(el=>el.checkValidity()),false,'Invalid phone rejected');
 await page.locator('#telefono').fill('+598 98 123 456');
 await page.getByRole('button',{name:'Enviar consulta'}).click();
 await page.locator('.quote-success').waitFor();
 assert.ok((await page.locator('.quote-success').innerText()).includes('no envía ni guarda'),'Simulation transparent');
 await page.setViewportSize({width:1280,height:900});
 await page.goto(base);
 await page.getByRole('button',{name:'Modelos de Motos',exact:true}).click();
 assert.equal(await page.locator('#desktop-models-motos').isVisible(),true,'Desktop catalog panel');
 await page.keyboard.press('Escape');
 assert.equal(await page.locator('#desktop-models-motos').isVisible(),false,'Desktop Escape');
 const sitemap = await (await fetch(base+'/sitemap.xml')).text();
 const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
 assert.equal(urls.length,32,'All 27 models plus 5 pages in sitemap');
 const descriptions = new Set();
 for(const path of urls){
  await page.goto(base+path);
  assert.equal(await page.locator('h1').count(),1);
  const description = await page.locator('meta[name="description"]').getAttribute('content');
  assert.ok(description.length >= 140 && description.length <= 160, `Description length ${path}: ${description.length}`);
  assert.ok(!descriptions.has(description), `Unique description ${path}`);
  descriptions.add(description);
  assert.ok(await page.locator('link[rel="canonical"]').getAttribute('href'));
 }
 const links=await page.locator('a[href*="wa.me"]').evaluateAll(els=>els.map(el=>({href:el.href,rel:el.rel,target:el.target})));
 assert.ok(links.every(a=>a.rel.includes('noopener')&&a.target==='_blank'));
 assert.equal(errors.length,0,'No browser errors: '+errors.join('; '));
 await fs.writeFile('artifacts/verification.json',JSON.stringify({checkedAt:new Date().toISOString(),results,errors,functional:'menu, filters, history, fixed CTA, colors, quote success, native validation, desktop dropdown, sitemap, all routes'},null,2));
 console.log('PASS: 45 responsive checks, 32 routes, menus, filters, colors, mobile CTA and quote form.');
} finally { await browser.close(); }
