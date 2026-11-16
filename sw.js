// Dictado Armónico · Service worker: precarga toda la app para que funcione sin conexión. Con conexión, la red manda (ver «fetch»),
// así que un cambio en un archivo llega sin tocar nada aquí. Al añadir o quitar archivos hay que actualizar ARCHIVOS y conviene subir
// VERSION: así se instala una caché nueva y se borran las antiguas.
// La prueba tests/estatico.test.mjs comprueba que ARCHIVOS coincide con los archivos reales.
'use strict';
const VERSION='dictado-armonico-v1';
const ARCHIVOS=[
  './',
  'index.html',
  'styles.css',
  'manifest.webmanifest',
  'iconos/apple-touch-icon.png',
  'iconos/icono-192.png',
  'iconos/icono-512.png',
  'iconos/icono.svg',
  'fonts/atkinson-hyperlegible-400-latin.woff2',
  'fonts/atkinson-hyperlegible-700-latin.woff2',
  'fonts/jetbrains-mono-latin.woff2',
  'fonts/pautado-cifra.woff',
  'fonts/pautado-simbolos.woff',
  'fonts/young-serif-400-latin.woff2',
  'js/audio.js',
  'js/datos.js',
  'js/ejercicio.js',
  'js/glifos.js',
  'js/inicio.js',
  'js/instrumentos.js',
  'js/interfaz.js',
  'js/pentagrama.js',
  'js/resumen.js',
  'js/secuencias.js',
  'js/teoria.js',
  'js/temas/t1.js',
  'js/temas/t2.js',
  'js/temas/t3.js',
  'js/temas/t4.js',
  'js/temas/t5.js',
  'js/temas/t6.js',
  'js/temas/t7.js',
  'js/temas/t8.js',
  'js/temas/t9.js'
];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(VERSION).then(c=>c.addAll(ARCHIVOS)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
// primero la red, para que nunca se quede una versión vieja: lo que llega bien se guarda en la caché (sin la cadena de consulta: ?semilla=…).
// Sin conexión, o si la red tarda más de ESPERA, se responde con lo guardado.
const ESPERA=3000;
self.addEventListener('fetch',e=>{ const u=new URL(e.request.url); if(e.request.method!=='GET'||u.origin!==self.location.origin) return;
  const red=fetch(e.request).then(r=>{ if(r&&r.ok){ const copia=r.clone(); caches.open(VERSION).then(c=>c.put(u.origin+u.pathname,copia)).catch(()=>{}); } return r; });
  red.catch(()=>{});
  e.respondWith(Promise.race([red,new Promise((_,no)=>setTimeout(no,ESPERA))]).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||red))); });
