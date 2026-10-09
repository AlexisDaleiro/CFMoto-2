import { chromium, firefox, webkit } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { testHeaders } from './test-headers.mjs';
const results=[];
const base = process.env.TEST_URL || 'http://127.0.0.1:3000';
const headers=await testHeaders(base);
for(const [name,engine] of [['Chrome',chromium],['Firefox',firefox],['WebKit',webkit]]) {
 const browser=await engine.launch(name==='Chrome'?{channel:'chrome',headless:true}:{headless:true});
 try {
  const page=await browser.newPage({viewport:{width:390,height:844},extraHTTPHeaders:headers});
  const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/motos?cc=800',{waitUntil:'networkidle'});
  const supported=await page.evaluate(()=>typeof document.startViewTransition==='function');
  await page.evaluate(()=>{
   window.__transitionCount=0;
   if(!document.startViewTransition)return;
   const original=document.startViewTransition.bind(document);
   document.startViewTransition=(...args)=>{window.__transitionCount++;return original(...args);};
  });
  await page.locator('.model-card-link').filter({hasText:'800MT Touring'}).click();
  await page.waitForURL('**/motos/800mt-touring');
  await page.waitForTimeout(600);
  assert.ok((await page.locator('h1').innerText()).includes('800MT TOURING'));
  const transitions=await page.evaluate(()=>window.__transitionCount);
  if(supported) assert.ok(transitions>0,name+' view transition started');
  await page.getByRole('button',{name:'Abrir menú'}).click();
  const dialog=page.locator('#mobile-menu');
  assert.ok(await dialog.evaluate(el=>el.open));
  for(let i=0;i<12;i++){await page.keyboard.press('Tab');assert.ok(await page.evaluate(()=>document.querySelector('dialog').contains(document.activeElement)),name+' focus remains in dialog');}
  await page.keyboard.press('Escape');
  assert.equal(await dialog.evaluate(el=>el.open),false);
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.addInitScript(()=>{document.startViewTransition=undefined;});
  await page.goto(base+'/motos?cc=800');
  await page.locator('.model-card-link').filter({hasText:'800MT Touring'}).click();
  await page.waitForURL('**/motos/800mt-touring');
  assert.equal(errors.length,0,name+' no runtime errors');
  results.push({engine:name,version:browser.version(),nativeViewTransitions:supported,transitionsStarted:transitions,focusTrap:'pass',fallbackWithoutApi:'pass',errors});
  console.log(name,'PASS',supported?'native transitions':'instant fallback');
 }finally{await browser.close();}
}
await fs.writeFile(process.env.TEST_BROWSER_FILE || 'artifacts/browser-verification.json',JSON.stringify({checkedAt:new Date().toISOString(),environment:base,results},null,2));
