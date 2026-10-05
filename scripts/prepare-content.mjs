import fs from 'node:fs/promises';
import sharp from 'sharp';
const rows=[
['motos','150NK',150,2490],['motos','250NK',250,3990],['motos','300SR',300,4990],['motos','300NK',300,4490],['motos','400NK',400,5990],['motos','400GT',400,6990],['motos','450SR',450,7990],['motos','650MT',650,8990],['motos','650NK',650,7990],['motos','650GT',650,9990],['motos','650TR-G',650,10990],['motos','700CL-X Heritage',700,9990],['motos','700CL-X Sport',700,10990],['motos','800MT Touring',800,14990],['motos','800MT Sport',800,13490],
['cuatriciclos','CFORCE 450S',400,6490],['cuatriciclos','CFORCE 520L',500,7990],['cuatriciclos','CFORCE 625',600,9490],['cuatriciclos','CFORCE 625 Touring',600,10490],['cuatriciclos','CFORCE 850XC',800,12990],['cuatriciclos','CFORCE 1000',1000,14990],['cuatriciclos','CFORCE 1000 Overland',1000,17490],
['utv','ZFORCE 550EX',500,11990],['utv','UFORCE 600',600,13990],['utv','UFORCE 1000',1000,18990],['utv','UFORCE 1000 XL',1000,21990],['utv','ZFORCE 1000 Sport',1000,22990]];
const slug=s=>s.toLowerCase().replaceAll(' ','-');
const inventory=[];
const keyNames={'engine type':'Tipo de motor','displacement':'Cilindrada','bore x stroke':'Diámetro × carrera','bore ×stroke':'Diámetro × carrera','power':'Potencia','maximum power':'Potencia máxima','torque':'Torque','maximum torque':'Torque máximo','compression ratio':'Compresión','clutch':'Embrague','clutch type':'Embrague','throttle':'Acelerador','power mode':'Modos de conducción','length x width x height':'Largo × ancho × alto','wheelbase':'Distancia entre ejes','seat height':'Altura del asiento','minimum ground clearance':'Despeje mínimo','minimum ground distance':'Despeje mínimo','curb weight':'Peso en orden de marcha','dry weight':'Peso en seco','payload capacity':'Capacidad de carga','fuel capacity':'Tanque','fuel supply':'Alimentación','transmission':'Transmisión','drive':'Tracción','brake':'Frenos','suspension':'Suspensión','shock absorber':'Amortiguadores','rim':'Llantas','tire':'Neumáticos','front brake':'Freno delantero','rear brake':'Freno trasero','front suspension':'Suspensión delantera','rear suspension':'Suspensión trasera','front tire':'Neumático delantero','rear tire':'Neumático trasero','rear cargo capacity':'Carga de caja','ignition':'Encendido','colors':'Colores','fuel tank capacity':'Tanque','dashboard':'Instrumentación','headlight':'Faro','key':'Llave','magneto':'Magneto'};
const base='https://www.cfmoto.com';
async function asset(source,path){
 try{
  let buffer;
  if(source.startsWith('artifacts/'))buffer=await fs.readFile(source);
  else {const res=await fetch(base+source,{signal:AbortSignal.timeout(25000)});if(!res.ok)throw Error('HTTP '+res.status);buffer=Buffer.from(await res.arrayBuffer());}
  let pipeline=sharp(buffer).rotate().resize({width:2400,withoutEnlargement:true});
  const out=path.endsWith('.png')?await pipeline.png({compressionLevel:9}).toBuffer():await pipeline.flatten({background:'#17191b'}).jpeg({quality:85,mozjpeg:true}).toBuffer();
  await fs.mkdir('public'+path.slice(0,path.lastIndexOf('/')),{recursive:true});await fs.writeFile('public'+path,out);
  inventory.push({path,source:source.startsWith('artifacts/')?'https://www.cfmoto.com/content/dam/cfmoto/site/global/product/motorcycle/mt----mult-touring/800mt-touring/documentation/2021_800MT%20brochure_International.pdf#'+source.split('/').at(-1):base+source,bytes:out.length});
  return path;
 }catch(e){inventory.push({path,source:base+source,missing:e.message});return '';}
}
const models=[];
for(const [linea,nombre,segmentoCc,precioDesdeUsd] of rows){
 const s=slug(nombre);const r=JSON.parse(await fs.readFile('artifacts/sources/'+s+'.json','utf8'));const attrs=r.attrs.slice(4);const get=key=>attrs.find(a=>a.key===key)?.data;
 const all=(get('specification')??[]).flatMap(g=>g.specification);const spec=key=>all.find(f=>f.key.trim().toLowerCase()===key)?.value;
 const power=spec('maximum power')??spec('power'); const torque=spec('maximum torque')??spec('torque');const cc=spec('displacement');const wt=spec('curb weight');
 const destacado=['800mt-touring','cforce-1000','zforce-1000-sport'].includes(s);const dir='/images/'+linea+'/'+s;
 const model={slug:s,linea,nombre,segmentoCc,cilindradaCc:cc?parseFloat(cc):undefined,datosTecnicosVerificados:!!cc,precioDesdeUsd,destacado,bajada:cc?`${parseFloat(cc)} cc. ${linea==='motos'?'Para la ciudad y la ruta.':'Para el campo y los caminos de tierra.'}`:`Línea ${nombre}. Segmento ${segmentoCc} cc.`,imagenes:{hero:'',perfil:''},fuentes:cc?[r.url]:[]};
 if(power)model.potenciaHp=Number((parseFloat(power)*(power.toLowerCase().includes('kw')?1.34102209:1)).toFixed(1));
 if(torque)model.torqueNm=parseFloat(torque);if(wt)model.pesoKg=parseFloat(wt);
 if(cc)model.specs=get('specification').map(g=>({grupo:({'Engine':'Motor','Dimensions and Weight':'Dimensiones','Chassis':'Chasis'})[g.type]??g.type,filas:g.specification.map(f=>[keyNames[f.key.trim().toLowerCase()]??f.key.trim(),f.value.replace(/<br\s*\/?\s*>/g,' · ').replace(/<[^>]+>/g,'')])}));
 if(s==='800mt-touring'){
  Object.assign(model,{cilindradaCc:799,datosTecnicosVerificados:true,potenciaHp:95,torqueNm:77,pesoKg:231,bajada:'799 cc, dos cilindros. Del asfalto al balasto.',fuentes:['https://www.cfmoto.com/content/dam/cfmoto/site/global/product/motorcycle/mt----mult-touring/800mt-touring/documentation/2021_800MT%20brochure_International.pdf'],specs:[{grupo:'Motor',filas:[['Tipo','Bicilíndrico en línea, DOHC, refrigeración líquida'],['Cilindrada','799 cc'],['Potencia máxima','95 HP / 9.000 rpm'],['Torque máximo','77 Nm / 7.500 rpm'],['Compresión','12,7:1'],['Diámetro × carrera','88 × 65,7 mm']]},{grupo:'Transmisión',filas:[['Embrague','Multidisco húmedo, antirrebote CF-SC'],['Quickshifter','Bidireccional'],['Acelerador','Electrónico']]},{grupo:'Chasis',filas:[['Suspensión delantera','KYB, recorrido 160 mm'],['Suspensión trasera','KYB, recorrido 150 mm'],['Freno delantero','Doble disco J.Juan, 320 mm'],['Freno trasero','Disco J.Juan, 260 mm'],['Ruedas','Rayos, 19 pulgadas / 17 pulgadas']]},{grupo:'Dimensiones',filas:[['Largo × ancho × alto','2.234 × 853 × 1.277 mm'],['Distancia entre ejes','1.531 mm'],['Altura del asiento','≤ 825 mm'],['Peso en orden de marcha','≤ 231 kg, sin maletas'],['Tanque','≥ 19 L']]},{grupo:'Electrónica',filas:[['Instrumentación','TFT de 7 pulgadas'],['ABS','ABS en curva'],['Control crucero','Incluido'],['TPMS','Monitoreo de presión de neumáticos'],['Modos','Sport / Rain'],['Iluminación','LED']]}]});
  model.imagenes.hero=await asset('artifacts/sources/touring-extract/p02-01.png',dir+'/hero.jpg');
  model.imagenes.perfil=await asset('artifacts/sources/touring-extract/p04-02.png',dir+'/perfil.png');
  model.imagenes.galeria=[];for(const [i,p]of ['p05-01','p05-02','p06-03','p08-03','p09-08'].entries()) model.imagenes.galeria.push(await asset('artifacts/sources/touring-extract/'+p+'.png',dir+'/galeria-0'+(i+1)+'.jpg'));
  model.features=[{titulo:'Dos cilindros. 77 Nm.',texto:'Motor de 799 cc con acelerador electrónico y modos Sport y Rain. Embrague antirrebote CF-SC para los cambios de marcha.',imagen:await asset('artifacts/sources/touring-extract/p06-02.png',dir+'/feature-motor.jpg')},{titulo:'La ruta, a tu ritmo.',texto:'Quickshifter bidireccional y control crucero. Suspensiones KYB con 160 mm delante y 150 mm detrás.',imagen:await asset('artifacts/sources/touring-extract/p07-02.png',dir+'/feature-ruta.jpg')},{titulo:'Todo a la vista.',texto:'Tablero TFT de 7 pulgadas, conectividad Bluetooth y monitoreo de presión de los neumáticos.',imagen:await asset('artifacts/sources/touring-extract/p08-03.png',dir+'/feature-tablero.jpg')}];
 }else if(cc){
  model.imagenes.perfil=await asset(get('variant')?.[0]?.image??r.icon,dir+'/perfil.png');
  model.imagenes.hero=await asset(get('lpicturelist')?.imageList?.[0]??get('banner')?.[0]?.image,dir+'/hero.jpg');
  if(destacado){
   model.colores=[];for(const v of (get('variant')??[])) {const imagen=await asset(v.image,dir+'/color-'+slug(v.title)+'.png');if(imagen)model.colores.push({nombre:v.title.replaceAll('-',' '),hex:({'True Timber Camo':'#5c6045','Royal Blue':'#235a82','Lava Orange':'#c6672f','Ghost Grey':'#898b8d'})[v.title]??'#5b6168',imagen});}
   model.imagenes.galeria=[];for(const [i,p]of (get('lpicturelist')?.imageList??[]).slice(0,5).entries())model.imagenes.galeria.push(await asset(p,dir+'/galeria-0'+(i+1)+'.jpg'));
   const configs=attrs.filter(a=>a.key==='config'&&a.data.title&&a.data.description&&a.data.fullScreenImage);
   model.features=[];for(const [i,c]of configs.slice(0,3).entries())model.features.push({titulo:['963 cc para el campo.','Apoyo en cada rueda.','Dos plazas, un camino.'][i],texto:['Motor V-twin con inyección electrónica. Transmisión CVT con alta, baja, neutro, reversa y estacionamiento.','Suspensión delantera de doble brazo y trasera independiente. Amortiguadores de gas con compresión y rebote ajustables.','Distancia entre ejes de 1.480 mm. Asiento de pasajero con respaldo y agarraderas.'][i],imagen:await asset(c.data.fullScreenImage,dir+'/feature-0'+(i+1)+'.jpg')});
  }
 }
 if(destacado&&model.datosTecnicosVerificados)model.keySpecs=[{etiqueta:'Cilindrada',valor:String(model.cilindradaCc),unidad:'cc'},{etiqueta:'Potencia',valor:String(model.potenciaHp),unidad:'HP'},{etiqueta:'Torque',valor:String(model.torqueNm),unidad:'Nm'},{etiqueta:'Peso en orden de marcha',valor:String(model.pesoKg),unidad:'kg'}];
 models.push(model);console.log(s,model.imagenes.perfil?'images OK':'pending');
}
await asset('/content/dam/cfmoto/page-assets/home/cfmoto-logo-white.png','/images/cfmoto-logo.png');
await fs.mkdir('src/content',{recursive:true});
await fs.writeFile('src/content/modelos.ts','import type { Modelo } from "./types";\n\nexport const modelos = '+JSON.stringify(models,null,2)+' satisfies Modelo[];\n');
await fs.writeFile('artifacts/sources/image-inventory.json',JSON.stringify(inventory,null,2));
await fs.writeFile('IMAGES.md','# Imágenes oficiales CFMOTO\n\nRecursos locales, sin hotlinking. Ancho máximo 2400 px. Fotos Touring extraídas sin modificar contenido del folleto oficial (página e índice en el nombre de origen).\n\n| Archivo local | Origen | Estado |\n|---|---|---|\n'+inventory.map(i=>`| public${i.path} | ${i.source} | ${i.missing?'Pendiente: '+i.missing:'OK · '+Math.round(i.bytes/1024)+' KB'} |`).join('\n')+'\n\n## Pendientes\n\n'+models.filter(m=>!m.imagenes.perfil).map(m=>'- '+m.nombre+': página histórica retirada; se usa ImagenPendiente, sin sustituir por otro modelo.').join('\n')+'\n- Logo SVG: no localizado en el sitio global; se usa su PNG oficial transparente.\n- Colores de 800MT Touring: falta imagen de alta resolución por color; selector omitido hasta verificar las imágenes exactas.\n');
