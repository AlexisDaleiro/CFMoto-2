# Notas de la demo CFMOTO Uruguay

Actualizacion: 9 de octubre de 2026. Esta entrega implementa la segunda fase, pero no declara cerrados los hitos de contenido y rendimiento. Estado, preview fijado y evidencias: ENTREGA-FASE-2.md.

## Experiencia Implementada

Home, tres lineas, 27 fichas, Cotizar/Test ride, 404, sitemap y robots. Slugs y parametros publicos se conservan. Las tres fichas destacadas tienen cuatro cifras, cuatro o mas fotos de galeria, tres bloques de equipamiento y especificaciones agrupadas. ZFORCE 1000 Sport es el modelo exacto, no Sport R ni 950.

Los 27 modelos tienen fotografia oficial identificable y cilindrada documentada. Esto no certifica nitidez ni correspondencia con la oferta uruguaya: 23 modelos tienen algun recurso de menos de 1600 px; los anos/versiones no confirmados y las discrepancias permanecen en CATALOGO.md. Los recursos pequenos no se amplian para inventar detalle. La 800MT reemplaza el perfil de 325 x 217 por uno de 2400 x 1600; mantiene pendientes algunos detalles y colores oficiales de esa version.

## Simulaciones

- Cada precio es ilustrativo y se identifica como demo. Product conserva descripcion y marca, sin Offer ni precio ficticio estructurado.
- El formulario valida en servidor, conserva campos ante errores y bloquea el boton durante la validacion. El exito declara explicitamente que no envia, guarda ni agenda datos.
- Todos los CTAs de WhatsApp abren el mismo dialogo de prueba. Preparan cotizacion o test ride por modelo/linea, sin nombre, telefono ni departamento. Copiar y cerrar son las unicas acciones; Esc y retorno de foco funcionan.
- La generacion del mensaje es independiente del constructor de enlace externo. Ese constructor no se usa en ningun CTA de esta entrega.
- Direccion, horarios, telefonos, redes y talleres requieren aprobacion del distribuidor. Bikeup (2508 818) y MYM Salto (2508 8185) conservan los valores originales, con posibles errores documentados.
- No hay CMS, CRM, email, pagos, cuentas, financiacion, comparador, blog, analytics ni base de datos conectados. Las propuestas de operacion no se implementaron.

## Contenido Verificable

Fuentes y mercado de origen por modelo en src/content/modelos.ts; inventario por archivo en IMAGES.md. segmentoCc representa agrupacion comercial, no cilindrada. No se deduce ano de version a partir de la carpeta de una imagen.

Se omiten cifras discrepantes no resueltas: potencia del ZFORCE 1000 Sport y tanque de la 650GT. CFORCE 450S usa 400 cc de la ficha oficial sudafricana frente a 495 cc de la tabla uruguaya, con procedencia explicita. CFORCE 1000 conserva la tabla global de 71 HP, mientras su texto promocional dice 85 HP; la aprobacion local sigue pendiente. Los valores nuevos de 700CL-X conservan kW de origen.

SOLICITUD-MATERIALES.md es una solicitud consolidada preparada, no enviada. El responsable del proyecto debe gestionarla y aprobar version/ano, equipamiento, precios y derechos de uso.

## Evidencia y Limites

Build, lint y typecheck; pruebas automatizadas de 32 rutas, 45 combinaciones responsivas, DPR 1/2, menus, filtros/historial, formulario, doble activacion durante envio, copia/errores/foco/Esc y ausencia de enlaces reales de WhatsApp. Evidencia fechada: artifacts/verification.json.

Chrome, Firefox y WebKit verifican transicion, foco, Esc, navegacion sin API y movimiento reducido. artifacts/browser-verification.json. La cobertura automatizada no equivale a revisar cada combinacion manualmente. Safari real en iPhone y revision humana final de nitidez/contraste/control tactil siguen pendientes.

Lighthouse: ocho rutas y tres ejecuciones moviles por ruta, medianas independientes, sin seleccionar la mejor ejecucion. artifacts/lighthouse/METRICS.md y acceptance.json describen cada criterio. En local indexable se exige SEO 100; en preview se comprueba la exclusion de indexacion por separado. Los informes anteriores se conservan en artifacts/phase1/ y artifacts/phase2-iteration*-lighthouse/.

El limite obligatorio de JavaScript es 145.187 bytes gzip con el metodo original, no un cambio de metodologia para bajar el valor. El objetivo aspiracional de menos de 120 KB no se cumple. De la compilacion local final se identifican 130.744 bytes en chunks puros de framework/runtime; 14.374 en chunks mixtos de aplicacion y helpers compartidos. No es una atribucion exacta por modulo: la compresion no es aditiva. Detalle en artifacts/budget.json.

Event Timing de los tres recorridos es laboratorio, sin throttling, y no demuestra INP de usuarios reales. No se deriva INP a partir de TBT. artifacts/interactions.json conserva eventos y metodo.

## NoFallbackError

Se reprodujo el registro Internal: NoFallbackError con Next.js 16.3.8 al solicitar rutas de catalogo no generadas con dynamicParams=false. Cuatro rutas inexistentes devuelven HTTP 404 y la interfaz propia; el navegador no presenta errores. El manifest de prerender usa fallback=false. Evidencia: artifacts/404-diagnostic.json.

La asociacion con el rechazo de rutas estaticas del framework esta reproducida; la consola de produccion no expone una traza interna completa. No se ampliaron rutas ni actualizaron dependencias para ocultar el registro. Revisar la traza interna con el proveedor antes de considerar el diagnostico de causa completamente cerrado.

## Publicacion

Preview separado en el proyecto existente de Vercel. Produccion no se promovio y los despliegues anteriores se conservaron. Metadata y X-Robots-Tag usan noindex, nofollow; robots permite leer esa politica. Canonical, sitemap e imagenes sociales usan la URL del preview. El sitemap no fue enviado a buscadores.

La proteccion de Vercel sigue activa. El responsable debe abrir el preview con una sesion autorizada o preparar un enlace compartido para la presentacion. Las credenciales/cookies de las pruebas estan ignoradas y no forman parte de la entrega.
