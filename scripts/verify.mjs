import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { testHeaders } from './test-headers.mjs';
const base = process.env.TEST_URL || 'http://127.0.0.1:3000';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
await fs.mkdir('artifacts/screenshots', { recursive: true });
const errors = [];
const results = [];
const headers = await testHeaders(base);
try {
 const page = await browser.newPage({ extraHTTPHeaders: headers });
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
 assert.equal(await page.locator('#mobile-menu').evaluate(el=>el.open),true,'Menu opens');
 await page.keyboard.press('Escape');
 assert.equal(await page.locator('#mobile-menu').evaluate(el=>el.open),false,'Escape closes');
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
 await page.waitForFunction(()=>document.querySelector('#modelo')?.value==='800mt-touring');
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
 const sitemap = await (await fetch(base+'/sitemap.xml',{headers})).text();
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
  assert.equal(await page.locator('a[href*="wa.me"]').count(),0);
  const products=await page.locator('script[type="application/ld+json"]').evaluateAll(els=>els.map(el=>JSON.parse(el.textContent)).filter(item=>item['@type']==='Product'));
  assert.ok(products.every(product=>!product.offers),'No fictional Offer JSON-LD');
  const broken=await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src));
  assert.equal(broken.length,0,'Model assets '+path);
 }
 assert.equal(await page.locator('a[href*="wa.me"],a[href*="api.whatsapp"]').count(),0,'No real WhatsApp link');
 await page.goto(base+'/motos?cc=999');
 assert.equal(await page.locator('.catalog-cell').count(),0,'Empty filter');
 await page.getByRole('button',{name:'Ver todos los modelos',exact:true}).click();
 assert.equal(await page.locator('.catalog-cell').count(),15,'Reset empty filter');
 await page.goto(base+'/motos?cc=invalid');
 assert.equal(await page.locator('.catalog-cell').count(),15,'Malformed filter defaults to all');
 await page.goto(base+'/cotizar?modelo=invalid&testRide=no');
 assert.equal(await page.locator('#modelo').inputValue(),'','Invalid model ignored');
 assert.equal(await page.locator('input[name="testRide"]').isChecked(),false,'Only testRide=1 preselects');
 await page.goto(base+'/cotizar?modelo=800mt-touring&testRide=1');
 await page.waitForFunction(()=>document.querySelector('#modelo')?.value==='800mt-touring');
 await page.locator('#nombre').fill('Cliente de prueba');
 await page.locator('#telefono').fill('123');
 await page.locator('#departamento').selectOption('Canelones');
 await page.locator('form').evaluate(el=>el.noValidate=true);
 await page.getByRole('button',{name:'Enviar consulta'}).click();
 await page.getByRole('alert').waitFor();
 assert.equal(await page.locator('#nombre').inputValue(),'Cliente de prueba','Name retained after server error');
 assert.equal(await page.locator('#telefono').inputValue(),'123','Phone retained after server error');
 assert.equal(await page.locator('#departamento').inputValue(),'Canelones','Department retained after server error');
 assert.equal(await page.locator('input[name="testRide"]').isChecked(),true,'Test ride retained');
 await page.locator('#telefono').fill('098 123 456');
 let submissions=0;
 await page.route('**/cotizar?**',async route=>{
  if(route.request().method()==='POST'){
   submissions++;
   await new Promise(resolve=>setTimeout(resolve,700));
  }
  await route.continue();
 });
 await page.getByRole('button',{name:'Enviar consulta'}).click();
 const pendingButton=page.getByRole('button',{name:'Validando…'});
 await pendingButton.waitFor();
 assert.equal(await pendingButton.isDisabled(),true,'Pending submission disables button');
 await pendingButton.evaluate(button=>button.click());
 await page.locator('.quote-success').waitFor();
 assert.equal(submissions,1,'Second activation while pending does not submit twice');
 await page.unroute('**/cotizar?**');
 await page.getByRole('button',{name:'Ver mensaje de WhatsApp'}).click();
 await page.locator('.contact-demo[open]').waitFor();
 const message=await page.getByLabel('Mensaje preparado').inputValue();
 assert.match(message,/800MT Touring/);
 assert.match(message,/test ride/);
 assert.ok(!/Cliente de prueba|098|Canelones/.test(message),'Message excludes PII');
 for(let i=0;i<12;i++){await page.keyboard.press('Tab');assert.ok(await page.locator('.contact-demo').evaluate(el=>el.contains(document.activeElement)),'WhatsApp traps focus');}
 await page.evaluate(()=>{navigator.clipboard.writeText=async text=>{window.__copied=text;};});
 await page.getByRole('button',{name:'Copiar mensaje',exact:true}).click();
 await page.getByText('Mensaje copiado.',{exact:true}).waitFor();
 assert.equal(await page.evaluate(()=>window.__copied),message,'Clipboard receives prepared message');
 await page.evaluate(()=>{navigator.clipboard.writeText=async()=>{throw new Error('denied');};});
 await page.getByRole('button',{name:'Copiar mensaje',exact:true}).click();
 await page.getByText('No se pudo copiar.',{exact:false}).waitFor();
 await page.keyboard.press('Escape');
 assert.equal(await page.locator('.contact-demo').count(),0,'Escape unmounts dialog');
 await page.waitForFunction(()=>document.activeElement?.textContent.includes('Ver mensaje de WhatsApp'));
 assert.equal(await page.getByRole('button',{name:'Ver mensaje de WhatsApp'}).evaluate(el=>el===document.activeElement),true,'Focus returns');
 assert.equal(new URL(page.url()).pathname,'/cotizar','No WhatsApp navigation');
 for(const dpr of [1,2]){
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:dpr,extraHTTPHeaders:headers});
  const display=await context.newPage();
  for(const route of ['/','/motos/800mt-touring','/utv/zforce-1000-sport']){
   await display.goto(base+route,{waitUntil:'networkidle'});
   await display.screenshot({path:`artifacts/screenshots/dpr-${dpr}-${route.replaceAll('/','-')||'home'}.png`});
   assert.equal(await display.locator('img').evaluateAll(imgs=>imgs.filter(i=>i.complete&&!i.naturalWidth).length),0,'DPR assets render');
  }
  await context.close();
 }
 assert.equal(errors.length,0,'No browser errors: '+errors.join('; '));
 await fs.writeFile(process.env.TEST_VERIFICATION_FILE || 'artifacts/verification.json',JSON.stringify({checkedAt:new Date().toISOString(),environment:base,results,errors,functional:'menu, filters, history, fixed CTA, colors, quote success, native and server validation, retained fields, blocked double submission, WhatsApp copy/error/Escape/focus/privacy, invalid parameters, empty filters, JSON-LD without Offer, DPR 1/2, desktop dropdown, sitemap, all routes'},null,2));
 console.log('PASS: 45 responsive checks, 32 routes, menus, filters, colors, mobile CTA and quote form.');
} finally { await browser.close(); }
