# Mediciones de laboratorio

Entorno: http://127.0.0.1:3001. Última ejecución: 2026-10-09T04:22:54.708Z. Lighthouse 13, Chrome, 390 × 844, DPR 1, throttling simulado. Mediana independiente de tres ejecuciones por ruta. Todos los HTML y JSON se conservan.

| Ruta | Performance | Accesibilidad | Best Practices | SEO | LCP | CLS |
|---|---:|---:|---:|---:|---:|---:|
| / | 94 | 100 | 100 | 100 | 3.05 s | 0.0000 |
| /motos | 97 | 100 | 100 | 100 | 2.53 s | 0.0000 |
| /cuatriciclos | 95 | 100 | 100 | 100 | 2.90 s | 0.0000 |
| /utv | 98 | 100 | 100 | 100 | 2.26 s | 0.0000 |
| /motos/800mt-touring | 94 | 100 | 100 | 100 | 2.98 s | 0.0000 |
| /cuatriciclos/cforce-1000 | 93 | 100 | 100 | 100 | 3.13 s | 0.0000 |
| /utv/zforce-1000-sport | 94 | 100 | 100 | 100 | 3.06 s | 0.0000 |
| /cotizar | 99 | 100 | 100 | 100 | 1.96 s | 0.0000 |

Criterios: Performance/Accesibilidad/Best Practices ≥ 95; LCP ≤ 2,5 s; CLS < 0,05. SEO 100 únicamente en la compilación local indexable. Resultado por criterio: acceptance.json.

JS inicial: **145118 bytes gzip**, límite 145.187: **cumple**. Objetivo aspiracional < 120 KB: **pendiente**.

Método idéntico a la referencia: scripts src únicos del HTML inicial, recomprimidos individualmente con gzip de Node; excluye noModule y las precargas de otras rutas. Incluye framework, runtime y aplicación. No equivale a bytes de JavaScript ejecutados ni a toda la transferencia de la página.

Las mediciones no representan INP de usuarios reales. Event Timing de los recorridos está en artifacts/interactions.json.
