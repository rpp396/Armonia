// Dictado Armónico · Arranque. Debe ser el último script.
'use strict';

load();
$('#snd').innerHTML=SONIDOS.map(([v,x])=>`<option value="${v}"${v===store.set.snd?' selected':''}>${x}</option>`).join('');
bind();
render();
// al cargar las fuentes cambia el ancho de los textos de la partitura
if(document.fonts&&document.fonts.ready) document.fonts.ready.then(()=>{ if(V.tema!==null&&V.tab==='resumen') renderPanel(); });
// instalable y sin conexión: solo al servir la app por http(s). Con file:// no se hace nada (el navegador rechaza el manifiesto de un archivo local
// y daría un error en la consola), por eso el <link rel="manifest"> se añade desde aquí y no está en index.html.
if(/^https?:$/.test(location.protocol)){
  const l=document.createElement('link'); l.rel='manifest'; l.href='manifest.webmanifest'; document.head.appendChild(l);
  if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});
}
